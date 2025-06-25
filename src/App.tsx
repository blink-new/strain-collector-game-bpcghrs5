import React, { useState } from 'react';
import { Leaf, Users, Map, Book } from 'lucide-react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import toast from 'react-hot-toast';

interface Strain {
  id: string;
  name: string;
  type: 'sativa' | 'indica' | 'hybrid';
  rarity: 'common' | 'rare' | 'legendary';
  thc?: number;
  effects: string[];
  description: string;
  discovered: boolean;
  location: string;
}

interface GameState {
  playerName: string;
  level: number;
  experience: number;
  currentLocation: string;
  inventory: string[];
  discoveredStrains: string[];
  energy: number;
  money: number;
}

const STRAINS: Strain[] = [
  {
    id: 'og-kush',
    name: 'OG Kush',
    type: 'hybrid',
    rarity: 'common',
    thc: 24,
    effects: ['relaxed', 'euphoric', 'sleepy'],
    description: 'A classic West Coast strain with earthy, pine, and lemon flavors.',
    discovered: false,
    location: 'Forest Grove'
  },
  {
    id: 'blue-dream',
    name: 'Blue Dream',
    type: 'hybrid',
    rarity: 'common',
    thc: 18,
    effects: ['creative', 'energetic', 'happy'],
    description: 'Sweet berry aroma with balanced cerebral stimulation.',
    discovered: false,
    location: 'Meadow Fields'
  },
  {
    id: 'white-widow',
    name: 'White Widow',
    type: 'hybrid',
    rarity: 'rare',
    thc: 25,
    effects: ['focused', 'creative', 'uplifted'],
    description: 'Legendary strain with crystal-white trichomes.',
    discovered: false,
    location: 'Mountain Peak'
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    type: 'indica',
    rarity: 'rare',
    thc: 16,
    effects: ['relaxed', 'sleepy', 'hungry'],
    description: 'Dreamy, euphoric high that relaxes muscles and pacifies the mind.',
    discovered: false,
    location: 'Arctic Valley'
  },
  {
    id: 'purple-haze',
    name: 'Purple Haze',
    type: 'sativa',
    rarity: 'legendary',
    thc: 20,
    effects: ['euphoric', 'creative', 'energetic'],
    description: 'Legendary strain made famous by Jimi Hendrix.',
    discovered: false,
    location: 'Psychedelic Gardens'
  }
];

const LOCATIONS = [
  { name: 'Forest Grove', emoji: '🌲', description: 'Dense forest with hidden treasures' },
  { name: 'Meadow Fields', emoji: '🌾', description: 'Peaceful grasslands under the sun' },
  { name: 'Mountain Peak', emoji: '⛰️', description: 'High altitude with rare finds' },
  { name: 'Arctic Valley', emoji: '❄️', description: 'Cold region with unique strains' },
  { name: 'Psychedelic Gardens', emoji: '🌈', description: 'Mystical garden of legends' }
];

function App() {
  const [gameState, setGameState] = useState<GameState>({
    playerName: 'Chill Dude',
    level: 1,
    experience: 0,
    currentLocation: 'Forest Grove',
    inventory: [],
    discoveredStrains: [],
    energy: 100,
    money: 50
  });

  const [activeTab, setActiveTab] = useState<'explore' | 'strains' | 'inventory'>('explore');

  const getCurrentLocationStrains = () => {
    return STRAINS.filter(strain => strain.location === gameState.currentLocation);
  };

  const getDiscoveredStrains = () => {
    return STRAINS.filter(strain => gameState.discoveredStrains.includes(strain.id));
  };

  const exploreForStrains = () => {
    if (gameState.energy < 10) {
      toast.error('Not enough energy! Rest to recover.');
      return;
    }

    const locationStrains = getCurrentLocationStrains();
    const undiscoveredStrains = locationStrains.filter(strain => 
      !gameState.discoveredStrains.includes(strain.id)
    );

    if (undiscoveredStrains.length === 0) {
      toast.success('You\'ve found all strains in this area!');
      return;
    }

    const chance = Math.random();
    let foundStrain = null;

    if (chance < 0.3) { // 30% chance to find a strain
      foundStrain = undiscoveredStrains[Math.floor(Math.random() * undiscoveredStrains.length)];
      
      setGameState(prev => ({
        ...prev,
        discoveredStrains: [...prev.discoveredStrains, foundStrain.id],
        inventory: [...prev.inventory, foundStrain.id],
        experience: prev.experience + (foundStrain.rarity === 'legendary' ? 50 : foundStrain.rarity === 'rare' ? 25 : 10),
        energy: prev.energy - 10
      }));

      toast.success(`🌿 Found ${foundStrain.name}!`, {
        duration: 3000,
        style: {
          background: '#22c55e',
          color: 'white',
        }
      });
    } else {
      setGameState(prev => ({
        ...prev,
        energy: prev.energy - 10,
        experience: prev.experience + 2
      }));
      toast('Keep searching... 🔍');
    }
  };

  const changeLocation = (newLocation: string) => {
    if (gameState.energy < 15) {
      toast.error('Not enough energy to travel!');
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentLocation: newLocation,
      energy: prev.energy - 15
    }));
    toast.success(`Traveled to ${newLocation} ✈️`);
  };

  const restoreEnergy = () => {
    setGameState(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 30)
    }));
    toast.success('Feeling refreshed! 😌');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'legendary': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sativa': return 'text-orange-600';
      case 'indica': return 'text-purple-600';
      case 'hybrid': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-green-50 font-mono">
      {/* Gameboy-style Header */}
      <div className="bg-green-800 text-green-100 p-4 border-b-4 border-green-900">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-green-900 p-2 rounded-lg">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider">🌿 STRAIN COLLECTOR 🌿</h1>
              <p className="text-green-300">Level {gameState.level} • {gameState.playerName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm text-green-300">Energy</p>
                <Progress value={gameState.energy} className="w-20 h-2" />
              </div>
              <div>
                <p className="text-sm text-green-300">EXP: {gameState.experience}</p>
                <p className="text-sm text-green-300">💰 ${gameState.money}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-green-700 border-b-4 border-green-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'explore', label: 'Explore', icon: Map },
              { id: 'strains', label: 'Strain Dex', icon: Book },
              { id: 'inventory', label: 'Stash', icon: Users }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={`${
                  activeTab === tab.id 
                    ? 'bg-green-500 text-white' 
                    : 'text-green-200 hover:bg-green-600'
                } rounded-none border-none`}
                onClick={() => setActiveTab(tab.id as 'explore' | 'strains' | 'inventory')}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Explore Tab */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            <Card className="p-6 bg-green-100 border-green-300">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                📍 Current Location: {gameState.currentLocation}
              </h2>
              <p className="text-green-700 mb-4">
                {LOCATIONS.find(loc => loc.name === gameState.currentLocation)?.description}
              </p>
              
              <div className="flex space-x-4 mb-6">
                <Button 
                  onClick={exploreForStrains}
                  disabled={gameState.energy < 10}
                  className="bg-green-600 hover:bg-green-700 retro-button"
                >
                  🔍 Search for Strains (10 Energy)
                </Button>
                <Button 
                  onClick={restoreEnergy}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 retro-button"
                >
                  😴 Rest & Recover
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentLocationStrains().map(strain => (
                  <Card key={strain.id} className="p-4 bg-white border-green-200 strain-card">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-green-800">{strain.name}</h3>
                      <Badge className={`${getRarityColor(strain.rarity)} text-white animate-pulse`}>
                        {strain.rarity}
                      </Badge>
                    </div>
                    <p className={`text-sm ${getTypeColor(strain.type)} mb-2 font-semibold`}>
                      {strain.type.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{strain.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {strain.effects.map(effect => (
                        <Badge key={effect} variant="outline" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                    {gameState.discoveredStrains.includes(strain.id) && (
                      <div className="mt-2 text-green-600 text-sm animate-bounce">✅ Discovered!</div>
                    )}
                  </Card>
                ))}
              </div>
            </Card>

            {/* Location Map */}
            <Card className="p-6 bg-green-100 border-green-300">
              <h3 className="text-xl font-bold text-green-800 mb-4">🗺️ Travel Map</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {LOCATIONS.map(location => (
                  <Button
                    key={location.name}
                    variant={gameState.currentLocation === location.name ? 'default' : 'outline'}
                    className={`p-4 h-auto retro-button ${
                      gameState.currentLocation === location.name
                        ? 'bg-green-600 text-white'
                        : 'border-green-600 text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => changeLocation(location.name)}
                    disabled={gameState.currentLocation === location.name || gameState.energy < 15}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{location.emoji}</div>
                      <div className="font-bold">{location.name}</div>
                      <div className="text-xs mt-1">{location.description}</div>
                      {gameState.currentLocation !== location.name && (
                        <div className="text-xs mt-1 opacity-75">15 Energy</div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Strain Dex Tab */}
        {activeTab === 'strains' && (
          <div className="space-y-4">
            <Card className="p-6 bg-green-100 border-green-300">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                📚 Strain Dex ({getDiscoveredStrains().length}/{STRAINS.length})
              </h2>
              <Progress value={(getDiscoveredStrains().length / STRAINS.length) * 100} className="mb-4" />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STRAINS.map(strain => {
                const discovered = gameState.discoveredStrains.includes(strain.id);
                return (
                  <Card key={strain.id} className={`p-4 ${discovered ? 'bg-white' : 'bg-gray-100'} border-green-200`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-green-800">
                        {discovered ? strain.name : '???'}
                      </h3>
                      <Badge className={`${getRarityColor(strain.rarity)} text-white`}>
                        {discovered ? strain.rarity : '???'}
                      </Badge>
                    </div>
                    {discovered ? (
                      <>
                        <p className={`text-sm ${getTypeColor(strain.type)} mb-2`}>
                          {strain.type.toUpperCase()} • THC: {strain.thc}%
                        </p>
                        <p className="text-sm text-gray-600 mb-2">{strain.description}</p>
                        <p className="text-xs text-green-600 mb-2">📍 {strain.location}</p>
                        <div className="flex flex-wrap gap-1">
                          {strain.effects.map(effect => (
                            <Badge key={effect} variant="outline" className="text-xs">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500">Discover this strain to learn more!</p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <Card className="p-6 bg-green-100 border-green-300">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                🎒 Your Stash ({gameState.inventory.length} strains)
              </h2>
            </Card>

            {gameState.inventory.length === 0 ? (
              <Card className="p-8 text-center bg-white border-green-200">
                <p className="text-gray-500 mb-4">Your stash is empty!</p>
                <p className="text-sm text-green-600">Go explore and find some strains!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameState.inventory.map((strainId, index) => {
                  const strain = STRAINS.find(s => s.id === strainId)!;
                  return (
                    <Card key={`${strainId}-${index}`} className="p-4 bg-white border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-green-800">{strain.name}</h3>
                        <Badge className={`${getRarityColor(strain.rarity)} text-white`}>
                          {strain.rarity}
                        </Badge>
                      </div>
                      <p className={`text-sm ${getTypeColor(strain.type)} mb-2`}>
                        {strain.type.toUpperCase()} • THC: {strain.thc}%
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{strain.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {strain.effects.map(effect => (
                          <Badge key={effect} variant="outline" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;