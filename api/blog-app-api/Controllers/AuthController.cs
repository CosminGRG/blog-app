using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using BlogApp_API.Controllers;
using BlogApp_API.GenericRepository;
using BlogApp_API.Models;
using BlogApp_API.Repositories;
using BlogApp_API.ViewModels;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace BlogApp_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepo;
    private readonly IRoleRepository _roleRepo;
    private readonly IConfiguration _configuration;

    public AuthController(
        IUserRepository userRepo,
        IRoleRepository roleRepo,
        IConfiguration configuration
    )
    {
        _userRepo = userRepo;
        _roleRepo = roleRepo;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginDTO model)
    {
        string email = SanitizeInput(model.Email);
        string password = SanitizeInput(model.Password);

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            return BadRequest("Email and Password are required");
        }

        if (!IsValidEmail(email))
        {
            return BadRequest("Invalid email address format.");
        }

        if (!IsValidPassword(password))
        {
            return BadRequest("Invalid email or password.");
        }

        bool emailExists = await EmailExistsAsync(email);
        if (!emailExists)
        {
            return Unauthorized("Invalid email or password.");
        }

        User authenticatedUser;
        try
        {
            authenticatedUser = await AuthenticateUser(email, password);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.GetType().FullName);
            Console.WriteLine(ex.Message);
            return Unauthorized("Invalid email or password");
        }

        var token = GenerateJwt(authenticatedUser);

        return Ok(token);
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterDTO model)
    {
        string email = SanitizeInput(model.Email);
        string password = SanitizeInput(model.Password);
        string username = SanitizeInput(model.Username);

        if (
            string.IsNullOrEmpty(email)
            || string.IsNullOrEmpty(username)
            || string.IsNullOrEmpty(password)
        )
        {
            return BadRequest("Username, Email and Password are requiered.");
        }

        if (!IsValidEmail(email))
        {
            return BadRequest("Invalid email address format.");
        }

        if (!IsValidPassword(password))
        {
            return BadRequest(
                "Invalid password format. Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            );
        }

        bool emailExists = await EmailExistsAsync(email);
        if (emailExists)
        {
            return Conflict("Email already in use.");
        }

        byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
        string hashedPassword = HashPassword(password, salt);

        var userRole = await _roleRepo.GetRoleByNameAsync("User");
        if (userRole == null)
        {
            return StatusCode(
                500,
                "An error occurred while processing your registration. Please try again later."
            );
        }

        var user = new User
        {
            Username = username,
            Email = email,
            Password = hashedPassword,
            PasswordSalt = salt,
            ProfilePicturePath = null,
            Role = userRole
        };

        try
        {
            await _userRepo.InsertAsync(user);
            await _userRepo.SaveAsync();

            user = await _userRepo.GetUserByEmailAsync(user.Email, true);
            if (user != null)
            {
                var token = GenerateJwt(user);
                return Ok(token);
            }
            else
            {
                return StatusCode(
                    500,
                    "An error occurred while processing your registration. Please try again later."
                );
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.GetType().FullName);
            Console.WriteLine(ex.Message);
            return StatusCode(
                500,
                "An error occurred while processing your registration. Please try again later."
            );
        }
    }

    private string GenerateJwt(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.RoleName),
        };

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
        );
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var SecToken = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(10080), //1 week
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(SecToken);
    }

    private async Task<User> AuthenticateUser(string email, string password)
    {
        var user = await _userRepo.GetUserByEmailAsync(email, true);
        if (user != null)
        {
            byte[] salt = user.PasswordSalt;
            if (salt.Length >= 0)
            {
                string hashedPassword = HashPassword(password, salt);

                var isAuthenticated = user.Password.SequenceEqual(hashedPassword);
                if (isAuthenticated)
                    return user;
            }
        }

        throw new InvalidOperationException("User not found or authentication failed.");
    }

    private bool IsValidEmail(string email)
    {
        string emailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

        return Regex.IsMatch(email, emailPattern);
    }

    private async Task<bool> EmailExistsAsync(string email)
    {
        bool emailExists = await _userRepo.UserEmailExistsAsync(email);

        return emailExists;
    }

    private bool IsValidPassword(string password)
    {
        int minLength = 8;
        int minLowercase = 1;
        int minUppercase = 1;
        int minDigit = 1;
        int minSpecialChar = 1;

        if (password.Length < minLength)
            return false;

        if (password.Count(char.IsLower) < minLowercase)
            return false;

        if (password.Count(char.IsUpper) < minUppercase)
            return false;

        if (password.Count(char.IsDigit) < minDigit)
            return false;

        if (password.Count(c => !char.IsLetterOrDigit(c)) < minSpecialChar)
            return false;

        return true;
    }

    private string HashPassword(string password, byte[] salt)
    {
        int iterationCount = 10000;

        byte[] hashedBytes = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: iterationCount,
            numBytesRequested: 256 / 8
        );

        return Convert.ToBase64String(hashedBytes);
    }

    private string SanitizeInput(string input)
    {
        return input.Replace("'", "''");
    }
}
