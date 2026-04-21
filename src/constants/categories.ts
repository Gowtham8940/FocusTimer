import {Category} from '../types/models';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'studying',
    name: 'Studying',
    isPredefined: true,
    subcategories: [
      {id: 'english', name: 'English'},
      {id: 'maths', name: 'Maths'},
      {id: 'accounts', name: 'Accounts'},
    ],
  },
  {
    id: 'running',
    name: 'Running',
    isPredefined: true,
    subcategories: [
      {id: 'jogging', name: 'Jogging'},
      {id: 'sprint', name: 'Sprint'},
    ],
  },
  {
    id: 'sleeping',
    name: 'Sleeping',
    isPredefined: true,
    subcategories: [{id: 'power-nap', name: 'Power Nap'}],
  },
  {
    id: 'playing',
    name: 'Playing',
    isPredefined: true,
    subcategories: [
      {id: 'cricket', name: 'Cricket'},
      {id: 'football', name: 'Football'},
    ],
  },
  {
    id: 'others',
    name: 'Others',
    isPredefined: true,
    subcategories: [],
  },
];
