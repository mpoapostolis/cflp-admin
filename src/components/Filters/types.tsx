export type Option = {
  label: string;
  value: string | number;
};

export type SelectFilter = {
  keyName: string;
  options: Option[];
  label: string;
  type: 'select';
};

export type DateFilter = {
  keyNameFrom: string;
  keyNameTo: string;
  type: 'date';
};

export type FilterType = SelectFilter | DateFilter;
