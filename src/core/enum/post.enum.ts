export enum POST_TYPE {
  QUESTION_ANSWER = 0,
  BULLETIN_BOARD = 1,
  FEEDBACK = 2,
}

export const translatePost = (post: number): string => {
  switch (post) {
    case 0: {
      return 'Dúvidas';
    }
    case 1: {
      return 'Quadro de Avisos';
    }
    case 2: {
      return 'Sugestões & Melhorias';
    }
  }
  return '';
};
