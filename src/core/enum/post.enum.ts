export enum POST_TYPE {
  QUESTION_ANSWER = 0,
  BULLETIN_BOARD = 1,
  FEEDBACK = 2,
}

export const translatePost = (post: number): string => {
  switch (post) {
    case 0: {
      return 'Dúvidas & Sugestões';
    }
    case 1: {
      return 'Avisos';
    }
    case 2: {
      return 'Reclamações';
    }
    case 3: {
      return 'Outros';
    }
  }
  return '';
};
