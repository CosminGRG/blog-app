import React from "react";
import Button from 'react-bootstrap/Button'

function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div>
          <Button size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            {"<"}
          </Button>
          <span style={{ margin: '0 10px' }}>{currentPage} of {totalPages}</span>
          <Button size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            {">"}
          </Button>
        </div>
      );
};

export default Pagination;