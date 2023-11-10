const convertToObject = (formData: FormData) => {
  let formDataObject: Record<string, string> = {};

  for (let key of formData.keys()) {
    Object.defineProperty(formDataObject, key, {
      writable: true,
      enumerable: true,
      value: formData.get(key),
    });
  }

  return formDataObject;
};

const validateFalsify = (formData: FormData, keys: string[]) => {
  // * checks if given form data include every key that needed
  // * also check if they are empty or not

  const formDataObject = convertToObject(formData);

  for (let i = 0; i < keys.length; i++) {
    if (
      formDataObject[keys[i]] === undefined ||
      formDataObject[keys[i]].trim().length === 0
    ) {
      return false;
    }
  }

  return true;
};

export { convertToObject, validateFalsify };
