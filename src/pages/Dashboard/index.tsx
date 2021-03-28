import { useState, useEffect } from 'react';

import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import api from '../../services/api';

export interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export function Dashboard () {
  const [foods, setFoods] = useState<FoodProps[]>([])
  const [editingFood, setEditingFood] = useState<FoodProps>({} as FoodProps)
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const loadFoods = async () => {
      const {data: foods} = await api.get('/foods');

      setFoods(foods);
    };
    
    loadFoods();
  }, []);

  async function handleAddFood(food: FoodProps) {
    try {
      const {data: newFood} = await api.post('/foods', 
      {...food, available: true});

      setFoods([...foods, newFood]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodProps) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food
      });

      const foodsUpdated = foods.map(food =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data);

        setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food: FoodProps) {
    setEditModalOpen(true);
    setEditingFood(food);
  }

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }
