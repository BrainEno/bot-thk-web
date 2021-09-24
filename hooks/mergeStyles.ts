import { IBlogWithStyle } from '../types';

const mergeStyles = (
  posts: IBlogWithStyle[],
  config: { [key: number]: any }
) => {
  posts.forEach((post, index) => {
    post.style = config[index];
    post.author = post.author;
    post.description = post.description;
  });
};

export const normalConfig = {
  0: {
    gridArea: '1/1/2/2'
  }
};

export const trendingConfig = {
  0: {
    gridArea: '1/2/3/3'
  },
  1: { height: '173px' },
  3: {
    height: '173px'
  }
};

export const featuredConfig = {
  0: {
    gridArea: '2/3/5/5',
    height: '635px'
  },
  1: {
    gridArea: '1/1/2/5',
    height: '400px'
  },

  2: {
    height: '300px'
  },
  3: {
    height: '300px'
  },
  4: {
    gridArea: '3/1/4/3',
    height: '300px'
  }
};

export const relatedConfig = {
  0: {
    height: '275px'
  },
  2: {
    height: '275px'
  }
};

export default mergeStyles;
