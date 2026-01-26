export enum POST_TYPE {
  QUESTION_FEEDBACK = 0,
  BULLETIN_BOARD = 1,
  COMPLAINS = 2,
  RECOMMENDATIONS = 3,
  DECLUTTER = 4,
  OTHERS = 5,
}

export const translatePostToString = (post: POST_TYPE): string => {
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
      return 'Recomendações';
    }
    case 4: {
      return 'Desapegos';
    }
    case 5: {
      return 'Outros';
    }
  }
  return 'Outros';
};

export const translatePostToNumber = (post: string): POST_TYPE => {
  switch (post) {
    case 'Dúvidas & Sugestões': {
      return 0;
    }
    case 'Avisos': {
      return 1;
    }
    case 'Reclamações': {
      return 2;
    }
    case 'Recomendações': {
      return 3;
    }
    case 'Desapegos': {
      return 4;
    }
    case 'Outros': {
      return 5;
    }
  }
  return 5;
};
