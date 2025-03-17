const getSelectedOptionValue = (id, options) => {
  if (!options || options.length === 0) {
    return null;
  }

  if (Array.isArray(id)) {
    return options.filter(option => id.includes(option.id));
  } else {
    return options.find(option => option.id === id) || null;
  }
};

export { getSelectedOptionValue };
