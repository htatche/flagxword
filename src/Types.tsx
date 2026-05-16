export type CountryElement = {
  name: {
    common: string;
  };
  cca2: string;
  img?: string;
};

export type Cell = {
  letter: string;
  img?: {
    src: string;
    alt: string;
  };
  fulfilled: boolean;
  enabled: boolean;
};
