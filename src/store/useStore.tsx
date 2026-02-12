import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FoodItem, CartItem, Restaurant } from '../types';

interface State {
  cart: CartItem[];
  isCartOpen: boolean;
  user: { name: string; email: string } | null;
}

type Action =
  | { type: 'ADD_TO_CART'; item: FoodItem }
  | { type: 'REMOVE_FROM_CART'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; delta: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' };

const initialState: State = {
  cart: [],
  isCartOpen: false,
  user: { name: 'Habesha Foodie', email: 'user@example.com' },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...action.item, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((i) => i.id !== action.id) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((i) => {
          if (i.id === action.id) {
            const newQty = Math.max(1, i.quantity + action.delta);
            return { ...i, quantity: newQty };
          }
          return i;
        }),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    default:
      return state;
  }
}

const StoreContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  
  return {
    ...context.state,
    addToCart: (item: FoodItem) => context.dispatch({ type: 'ADD_TO_CART', item }),
    removeFromCart: (id: string) => context.dispatch({ type: 'REMOVE_FROM_CART', id }),
    updateQuantity: (id: string, delta: number) => context.dispatch({ type: 'UPDATE_QUANTITY', id, delta }),
    clearCart: () => context.dispatch({ type: 'CLEAR_CART' }),
    toggleCart: () => context.dispatch({ type: 'TOGGLE_CART' }),
  };
};

export const CATEGORIES = [
  { id: '1', name: 'Traditional', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/ethiopian-food-hero-cf0a1534-1770885951913.webp' },
  { id: '2', name: 'Burgers', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/burgers-category-8b246013-1770885954150.webp' },
  { id: '3', name: 'Pizza', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/pizza-category-1983f889-1770885952406.webp' },
  { id: '4', name: 'Coffee', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/restaurant-placeholder-2-ed48c128-1770885952640.webp' },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Habesha Delight',
    rating: 4.8,
    deliveryTime: '25-35 min',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/restaurant-placeholder-1-79301eb5-1770885953045.webp',
    categories: ['Traditional', 'Breakfast'],
    menu: [
      { id: 'm1', name: 'Special Beyaynetu', price: 350, description: 'Traditional platter with various wats and injera.', image: 'https://images.unsplash.com/photo-1541518763669-27f904917539?q=80&w=800', category: 'Traditional' },
      { id: 'm2', name: 'Doro Wat', price: 450, description: 'Classic spicy chicken stew with boiled egg.', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/ethiopian-food-hero-cf0a1534-1770885951913.webp', category: 'Traditional' },
    ]
  },
  {
    id: 'r2',
    name: 'Burger World',
    rating: 4.5,
    deliveryTime: '20-30 min',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/burgers-category-8b246013-1770885954150.webp',
    categories: ['Burgers', 'Fast Food'],
    menu: [
      { id: 'm3', name: 'Double Cheese Burger', price: 280, description: 'Juicy double patty with melted cheddar.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800', category: 'Burgers' },
      { id: 'm4', name: 'Spicy Chicken Burger', price: 250, description: 'Fried chicken with habanero mayo.', image: 'https://images.unsplash.com/photo-1525164286253-04e68b9d94bb?q=80&w=800', category: 'Burgers' },
    ]
  }
];