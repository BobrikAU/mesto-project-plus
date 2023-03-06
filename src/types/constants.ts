export const REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.!$'*;,~#?&/=]*)$/;
export const logs = {
  MAX_SIZE: '20m',
  MAX_FILES: '14d',
};
export const card = {
  name: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 30,
  },
};
export const user = {
  name: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 30,
  },
  about: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 200,
  },
};
