import { Pizza, OptionItem } from './types';

export const CRUST_OPTIONS: OptionItem[] = [
  { id: 'trad', name: 'Tradicional', price: 0 },
  { id: 'cat', name: 'Recheada com Catupiry', price: 15.00 },
  { id: 'ched', name: 'Recheada com Cheddar', price: 15.00 },
  { id: 'choc', name: 'Borda de Chocolate', price: 18.00 },
];

export const ADDON_OPTIONS: OptionItem[] = [
  { id: 'corn', name: 'Milho', price: 3.00 },
  { id: 'bacon', name: 'Bacon Extra', price: 8.00 },
  { id: 'cheese', name: 'Mussarela Extra', price: 6.00 },
  { id: 'onion', name: 'Cebola Roxa', price: 2.00 },
  { id: 'olive', name: 'Azeitonas', price: 3.00 },
];

export const PIZZAS: Pizza[] = [
  {
    id: 999,
    name: "Monte sua Meio a Meio",
    description: "Escolha dois sabores do nosso cardápio e pague pelo de maior valor. A combinação perfeita!",
    price: 0, // Preço base zero, calculado na montagem
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
    category: "Meio a Meio",
    rating: 5.0
  },
  {
    id: 1,
    name: "Margherita Supreme",
    description: "Molho de tomate artesanal, mussarela de búfala fresca, manjericão colhido na hora e azeite extra virgem.",
    price: 45.90,
    image: "https://picsum.photos/id/1080/600/400",
    category: "Classica",
    rating: 4.8
  },
  {
    id: 2,
    name: "Pepperoni Picante",
    description: "Generosas fatias de pepperoni, mix de queijos, toque de pimenta calabresa e mel picante opcional.",
    price: 52.90,
    image: "https://picsum.photos/id/292/600/400",
    category: "Classica",
    rating: 4.9
  },
  {
    id: 3,
    name: "Quatro Queijos Trufada",
    description: "Gorgonzola, provolone, parmesão e mussarela finalizados com um fio de azeite trufado.",
    price: 58.90,
    image: "https://picsum.photos/id/835/600/400",
    category: "Especial",
    rating: 4.7
  },
  {
    id: 4,
    name: "Calabresa Caramelizada",
    description: "Calabresa defumada fatiada finamente, cebola roxa caramelizada e orégano fresco.",
    price: 48.90,
    image: "https://picsum.photos/id/488/600/400",
    category: "Classica",
    rating: 4.6
  },
  {
    id: 5,
    name: "Veggie Garden",
    description: "Abobrinha grelhada, berinjela, pimentões coloridos, cogumelos frescos e queijo vegano.",
    price: 54.90,
    image: "https://picsum.photos/id/225/600/400",
    category: "Vegana",
    rating: 4.5
  },
  {
    id: 6,
    name: "Frango com Catupiry Real",
    description: "Frango desfiado temperado com ervas finas e coberto com o autêntico Catupiry.",
    price: 50.90,
    image: "https://picsum.photos/id/312/600/400",
    category: "Especial",
    rating: 4.9
  },
  {
    id: 7,
    name: "Chocolate com Morango",
    description: "Base de chocolate ao leite derretido coberta com morangos frescos selecionados.",
    price: 39.90,
    image: "https://picsum.photos/id/425/600/400",
    category: "Doce",
    rating: 4.8
  },
  {
    id: 8,
    name: "Banana Nevada",
    description: "Banana fatiada, leite condensado, canela em pó e raspas de chocolate branco.",
    price: 38.90,
    image: "https://picsum.photos/id/824/600/400",
    category: "Doce",
    rating: 4.7
  },
  {
    id: 9,
    name: "Broto Calabresa",
    description: "A clássica calabresa em tamanho individual. Ideal para um lanche rápido.",
    price: 28.90,
    image: "https://picsum.photos/id/488/600/400",
    category: "Broto",
    rating: 4.6
  },
  {
    id: 10,
    name: "Broto 4 Queijos",
    description: "Mix de queijos selecionados em tamanho individual.",
    price: 32.90,
    image: "https://picsum.photos/id/835/600/400",
    category: "Broto",
    rating: 4.8
  }
];