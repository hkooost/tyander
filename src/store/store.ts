import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

const BASE_API: string = 'https://nekos.best/api/v2/waifu?amount=3';
const BASE_DATA: string = 'https://fakerapi.it/api/v2/persons?_quantity=3&_gender=female&_birthday_start=1999-01-01&_birthday_end=2003-01-01';

interface User {
  id: number;
  firstname: string;
  address: {
    country: string;
    city: string;
  };
}

interface Image {
  url: string;
}

interface ImageResponse {
  results: Image[];
}

interface UserResponse {
  data: User[];
}

export interface CombinedData {
  id: number;
  firstname: string;
  country: string;
  city: string;
  imageUrl: string;
}

class CardDeckStore {
  combinedData: CombinedData[] = [];
  loading: boolean = true;
  error: string | null = null;
  savedCards: CombinedData[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchData = async () => {
    try {
      const [userRes, imageRes] = await Promise.all([
        axios.get<UserResponse>(BASE_DATA),
        axios.get<ImageResponse>(BASE_API)
      ]);

      const users = userRes.data.data;
      const images = imageRes.data.results;

      const combined: CombinedData[] = users.map((user, index) => ({
        id: Date.now() + index,
        firstname: user.firstname,
        country: user.address.country,
        city: user.address.city,
        imageUrl: images[index]?.url || '',
      }));

      runInAction(() => {
        this.combinedData.unshift(...combined);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = `${error}`;
        this.loading = false;
      });
    }
  };
  saveCard = (id: number) => {
    const cardToAdd = this.combinedData.find(user => user.id === id);
    if (cardToAdd) {
      runInAction(() => {
        this.savedCards.push(cardToAdd);
        this.combinedData = this.combinedData.filter(user => user.id !== id);
      });
      if (this.combinedData.length <= 2) {
        this.fetchData();
      }
    }
  };
  removeCard = (id: number) => {
    const cardToRemove = this.combinedData.find(user => user.id === id);
    if (cardToRemove) {
      runInAction(() => {
        this.combinedData = this.combinedData.filter(user => user.id !== id);
      });
      if (this.combinedData.length <= 2) {
        this.fetchData();
      }
    }
  };
}

export const cardDeckStore = new CardDeckStore();
