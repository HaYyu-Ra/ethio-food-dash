import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, MapPin, Star, Clock, ChevronRight, Phone, CreditCard, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- Types ---
type Category = { id: string; name: string; icon: string; image: string };
type MenuItem = { id: string; name: string; description: string; price: number; image: string; category: string };
type Restaurant = { id: string; name: string; rating: number; deliveryTime: string; deliveryFee: number; image: string; menu: MenuItem[] };
type CartItem = MenuItem & { quantity: number; restaurantId: string };

// --- Mock Data ---
const CATEGORIES: Category[] = [
  { id: '1', name: 'Ethiopian', icon: '🍲', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/ethiopian-hero-5dcba0ae-1770886291072.webp' },
  { id: '2', name: 'Burgers', icon: '🍔', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/burger-category-f6b56c39-1770886290872.webp' },
  { id: '3', name: 'Pizza', icon: '🍕', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/pizza-category-62e2b420-1770886289170.webp' },
  { id: '4', name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400' },
  { id: '5', name: 'Drinks', icon: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?auto=format&fit=crop&q=80&w=400' },
];

const RESTAURANTS: Restaurant[] = [
  {
    id: 'res1',
    name: 'Habesha Delight',
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: 50,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/ethiopian-hero-5dcba0ae-1770886291072.webp',
    menu: [
      { id: 'm1', name: 'Special Beyaynetu', description: 'Assorted vegan stews with fresh Injera', price: 280, image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400', category: 'Ethiopian' },
      { id: 'm2', name: 'Doro Wat', description: 'Traditional spicy chicken stew with egg', price: 350, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=400', category: 'Ethiopian' },
    ]
  },
  {
    id: 'res2',
    name: 'Burger King Plaza',
    rating: 4.5,
    deliveryTime: '15-25 min',
    deliveryFee: 40,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/burger-category-f6b56c39-1770886290872.webp',
    menu: [
      { id: 'm3', name: 'Double Cheese Burger', description: 'Two juicy patties with extra cheese', price: 420, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', category: 'Burgers' },
      { id: 'm4', name: 'Crispy Chicken Burger', description: 'Spicy breaded chicken breast', price: 380, image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&q=80&w=400', category: 'Burgers' },
    ]
  },
  {
    id: 'res3',
    name: 'Bella Pizza',
    rating: 4.6,
    deliveryTime: '30-45 min',
    deliveryFee: 60,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/pizza-category-62e2b420-1770886289170.webp',
    menu: [
      { id: 'm5', name: 'Pepperoni Feast', description: 'Classic pepperoni with mozzarella', price: 550, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400', category: 'Pizza' },
      { id: 'm6', name: 'Margherita', description: 'Fresh basil and tomatoes', price: 480, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=400', category: 'Pizza' },
    ]
  }
];

// --- Components ---

const Navbar = ({ cartCount, onCartClick, onHomeClick }: { cartCount: number, onCartClick: () => void, onHomeClick: () => void }) => (
  <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
        <div className="bg-orange-500 p-2 rounded-xl">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          EthioFood
        </span>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search for food, restaurants..." className="pl-10 w-full bg-gray-50 border-none focus-visible:ring-orange-500" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span>Addis Ababa, Bole</span>
        </div>
        <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-6 h-6" />
        </Button>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <div className="relative h-[400px] overflow-hidden rounded-3xl mt-6 mx-4 sm:mx-0">
    <img 
      src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/ca4f8fbb-3af3-4172-8e4e-e98aaa8e6f1d/delivery-hero-aafa22db-1770886289977.webp" 
      alt="Delivery Hero" 
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-12">
      <motion.h1 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-5xl font-bold text-white mb-4"
      >
        Hungry? <br /> We've Got You.
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-gray-200 text-lg mb-8 max-w-md"
      >
        Delicious food from your favorite restaurants delivered fast to your doorstep.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
          Order Now
        </Button>
      </motion.div>
    </div>
  </div>
);

const CategoryItem = ({ category, onClick }: { category: Category, onClick: () => void }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-3 cursor-pointer group"
  >
    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-transparent group-hover:border-orange-500 transition-all">
      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
    </div>
    <span className="text-sm font-semibold text-gray-700">{category.name}</span>
  </motion.div>
);

const RestaurantCard = ({ restaurant, onClick }: { restaurant: Restaurant, onClick: () => void }) => (
  <Card 
    className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border-none bg-white"
    onClick={onClick}
  >
    <div className="relative aspect-video">
      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-bold">{restaurant.rating}</span>
      </div>
    </div>
    <CardContent className="p-4">
      <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{restaurant.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-orange-500 font-medium">ETB {restaurant.deliveryFee} fee</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FoodItem = ({ item, onAdd }: { item: MenuItem, onAdd: () => void }) => (
  <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-orange-100 transition-all">
    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover shrink-0" />
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <h4 className="font-bold text-gray-900">{item.name}</h4>
        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="font-bold text-orange-600">ETB {item.price}</span>
        <Button size="sm" className="rounded-full bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border-orange-100 h-8" onClick={onAdd}>
          Add
        </Button>
      </div>
    </div>
  </div>
);

const PaymentIntegration = ({ total, onComplete }: { total: number, onComplete: () => void }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('telebirr');
  const [isProcessing, setIsProcessing] = useState(false);

  const methods = [
    { id: 'telebirr', name: 'Telebirr', color: 'bg-blue-600', icon: '📱' },
    { id: 'awash', name: 'Awash Birr', color: 'bg-red-700', icon: '🏦' },
    { id: 'cbe', name: 'CBE Birr', color: 'bg-purple-800', icon: '🏛️' },
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
      toast.success("Payment Successful!", {
        description: `Your order of ETB ${total} has been placed.`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        {methods.map((method) => (
          <div
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMethod === method.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center text-white text-xl font-bold`}>
                {method.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900">{method.name}</p>
                <p className="text-xs text-gray-500">Pay instantly from your wallet</p>
              </div>
            </div>
            {selectedMethod === method.id && <CheckCircle2 className="w-6 h-6 text-orange-500" />}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-xl space-y-2">
        <div className="flex justify-between text-sm">
          <span>Order Total</span>
          <span>ETB {total}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Transaction Fee</span>
          <span>ETB 0.00</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
          <span>To Pay</span>
          <span className="text-orange-600">ETB {total}</span>
        </div>
      </div>

      <Button 
        className="w-full h-12 bg-orange-500 hover:bg-orange-600 rounded-xl text-lg font-bold"
        disabled={isProcessing}
        onClick={handlePay}
      >
        {isProcessing ? "Processing..." : `Pay with ${methods.find(m => m.id === selectedMethod)?.name}`}
      </Button>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'restaurant' | 'checkout' | 'success'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: MenuItem, restaurantId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, restaurantId }];
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = selectedRestaurant?.deliveryFee || 0;
  const grandTotal = cartTotal + deliveryFee;

  const navigateToRestaurant = (res: Restaurant) => {
    setSelectedRestaurant(res);
    setView('restaurant');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans">
      <Toaster position="top-center" richColors />
      
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => { setView('home'); setSelectedRestaurant(null); }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <Hero />

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Categories</h2>
                  <Button variant="ghost" className="text-orange-500 font-semibold">View All</Button>
                </div>
                <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
                  {CATEGORIES.map(cat => (
                    <CategoryItem key={cat.id} category={cat} onClick={() => {}} />
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Popular Restaurants</h2>
                  <Button variant="ghost" className="text-orange-500 font-semibold">See More</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {RESTAURANTS.map(res => (
                    <RestaurantCard key={res.id} restaurant={res} onClick={() => navigateToRestaurant(res)} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'restaurant' && selectedRestaurant && (
            <motion.div
              key="restaurant"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 mt-6"
            >
              <Button variant="ghost" onClick={() => setView('home')} className="mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>

              <div className="relative h-[250px] rounded-3xl overflow-hidden">
                <img src={selectedRestaurant.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-end p-8">
                  <div className="text-white">
                    <h1 className="text-4xl font-bold">{selectedRestaurant.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold">{selectedRestaurant.rating}</span>
                      </div>
                      <span className="text-sm">• {selectedRestaurant.deliveryTime}</span>
                      <span className="text-sm">• ETB {selectedRestaurant.deliveryFee} delivery</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <Tabs defaultValue="all">
                    <TabsList className="bg-transparent gap-2">
                      <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-orange-500 data-[state=active]:text-white">All Menu</TabsTrigger>
                      <TabsTrigger value="popular" className="rounded-full data-[state=active]:bg-orange-500 data-[state=active]:text-white">Popular</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {selectedRestaurant.menu.map(item => (
                        <FoodItem key={item.id} item={item} onAdd={() => addToCart(item, selectedRestaurant.id)} />
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="hidden md:block">
                  <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold mb-4">Your Order</h3>
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Your cart is empty</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
                          {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                              <div className="flex-1">
                                <p className="font-bold text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">ETB {item.price}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-full border text-gray-400">-</button>
                                <span className="text-sm font-bold">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-full border text-gray-400">+</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>ETB {cartTotal}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Delivery</span>
                            <span>ETB {deliveryFee}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg pt-2">
                            <span>Total</span>
                            <span className="text-orange-600">ETB {grandTotal}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 rounded-xl" onClick={() => setView('checkout')}>
                          Go to Checkout
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto mt-12"
            >
               <Button variant="ghost" onClick={() => setView('restaurant')} className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Menu
              </Button>
              
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" /> Delivery Address
                  </h3>
                  <div className="p-4 border rounded-2xl bg-gray-50 border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold">Home</p>
                      <p className="text-sm text-gray-500">Bole Atlas, Around Edna Mall, Addis Ababa</p>
                    </div>
                    <Button variant="link" className="text-orange-500">Change</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-orange-500" /> Payment Method
                  </h3>
                  <PaymentIntegration 
                    total={grandTotal} 
                    onComplete={() => setView('success')} 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
              <p className="text-gray-500 mb-8 max-w-sm">
                Your food is being prepared and will be delivered in approximately 30 minutes.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="rounded-xl" onClick={() => { setView('home'); setCart([]); }}>
                  Return Home
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 rounded-xl">
                  Track Order
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Cart Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">My Cart</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <ShoppingCart className="w-20 h-20 text-gray-100 mb-4" />
                  <p className="text-xl font-semibold text-gray-400">Your cart is empty</p>
                  <Button 
                    className="mt-4 bg-orange-500 rounded-xl" 
                    onClick={() => setIsCartOpen(false)}
                  >
                    Browse Food
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <img src={item.image} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-bold">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                          <p className="text-orange-600 font-bold text-sm mt-1">ETB {item.price}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200 transition-colors"
                            >
                              -
                            </button>
                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto border-t pt-6 space-y-4">
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">ETB {cartTotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-gray-900">ETB {deliveryFee}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span className="text-orange-600">ETB {grandTotal}</span>
                    </div>
                    <Button 
                      className="w-full h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl text-lg font-bold shadow-lg shadow-orange-500/20"
                      onClick={() => {
                        setIsCartOpen(false);
                        setView('checkout');
                      }}
                    >
                      Check Out
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}