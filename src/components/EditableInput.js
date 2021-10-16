/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
import React, { useCallback, useState } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';

const EditableInput = ({
  initialValue,
  onSave,
  label,
  name = null,
  placeholder = 'Write Your Value',
  wrapperClassName,
  emptyMsg = 'Input is Empty',
  ...inputProps
}) => {
  const [input, setInput] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);
  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);
  const onEditClick = useCallback(() => {
    setIsEditable(editable => !editable);
    setInput(initialValue);
  }, [initialValue]);

  const onSaveClick = async () => {
    const trimmedValue = input.trim();

    if (trimmedValue === '') {
      Alert.info(emptyMsg, 4000);
    }
    if (trimmedValue !== initialValue) {
      await onSave(trimmedValue);
    }

    setIsEditable(false);
  };
  return (
    <div className={wrapperClassName}>
      {label}
      <InputGroup>
        <Input
          {...inputProps}
          disabled={!isEditable}
          placeholder={placeholder}
          value={input}
          onChange={onInputChange}
        />
        <InputGroup.Button onClick={onEditClick}>
          <Icon icon={isEditable ? 'close' : 'edit2'} />
        </InputGroup.Button>
        {isEditable && (
          <InputGroup.Button onClick={onSaveClick}>
            <Icon icon="check" />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
};

export default EditableInput;
