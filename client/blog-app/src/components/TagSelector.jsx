import React from 'react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

import axios from '../utils/api/axios.config.js';

import './TagSelector.css';

const API_URL = '/tag';

function TagSelector({ selectedTags, onTagsChange }) {
    const [tags, setTags] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(API_URL);
                setTags(response.data);
            } catch (error) {
                console.error('Unexpected error while fetching tags:', error);
                setError('Error fetching tags.');
            }
        };

        fetchTags();
    }, []);

    const handleTagsChange = (selectedOptions) => {
        onTagsChange(selectedOptions || []);
    };

    const handleTagAdd = async (inputValue) => {
        if (!inputValue) return;

        try {
            if (tags.find((tag) => tag.tagName === inputValue)) {
                console.log('Tag already exists.');
                return;
            }

            const response = await axios.post(API_URL, { tagName: inputValue });
            const createdTag = response.data;

            setTags([...tags, createdTag]);

            handleTagsChange([
                ...selectedTags,
                { value: createdTag.id, label: createdTag.tagName },
            ]);
        } catch (error) {
            console.error('Error adding new tag:', error);
            setError('Error adding new tag.');
        }
    };

    const mappedSelectedTags = selectedTags.map((tag) => ({
        value: tag.id,
        label: tag.tagName,
    }));

    return (
        <>
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <CreatableSelect
                    options={tags.map((tag) => ({
                        value: tag.id,
                        label: tag.tagName,
                    }))}
                    isMulti
                    isSearchable
                    placeholder="Select or add tags"
                    onChange={handleTagsChange}
                    value={selectedTags}
                    onCreateOption={handleTagAdd}
                />
            </div>
            {error && <p className="text-danger text-start">{error}</p>}
        </>
    );
}

export default TagSelector;
