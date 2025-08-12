import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { TrainerService } from '@/services/implementation/trainerServices';

export interface IPlan {
  _id?: string;
  trainerId: string;
  title: string;
  description: string;
  price: number;
  sessionsPerWeek: number;
  durationWeeks: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}


const SetPlansPage = () => {
  const {user} = useSelector((state:RootState)=>state.auth);
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [form, setForm] = useState<Partial<IPlan>>({
    title: '',
    description: '',
    price: 0,
    sessionsPerWeek: 0,
    durationWeeks: 0,
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchPlans = async () => {
        const response = await TrainerService.getPlans(user._id);
        setPlans(response.data);
      }
      fetchPlans();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPlan = await TrainerService.AddnewPlan(form,user!._id);
      // const newPlan = await api.post('/plans', { ...form, trainerId: user!._id });
      setPlans([...plans, newPlan.data]);
      setForm({ title: '', description: '', price: 0, sessionsPerWeek: 0, durationWeeks: 0, isActive: true });
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error creating plan');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Set Plans</h1>
      {error && <p className="text-destructive mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Plan Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Plan Title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Plan Description"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  placeholder="Price"
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionsPerWeek">Sessions per Week</Label>
                <Input
                  id="sessionsPerWeek"
                  type="number"
                  value={form.sessionsPerWeek}
                  onChange={(e) => setForm({ ...form, sessionsPerWeek: Number(e.target.value) })}
                  placeholder="Sessions per Week"
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationWeeks">Duration (Weeks)</Label>
                <Input
                  id="durationWeeks"
                  type="number"
                  value={form.durationWeeks}
                  onChange={(e) => setForm({ ...form, durationWeeks: Number(e.target.value) })}
                  placeholder="Duration in Weeks"
                  required
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <Button type="submit" className="w-full">Create Plan</Button>
            </form>
          </CardContent>
        </Card>
        {/* Existing Plans List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {plans.length === 0 ? (
              <p className="text-muted-foreground">No plans created yet.</p>
            ) : (
              <div className="space-y-4">
                {plans.map(plan => (
                  <Card key={plan._id}>
                    <CardContent className="pt-4">
                      <h3 className="text-lg font-semibold">{plan.title}</h3>
                      <p className="text-muted-foreground">{plan.description}</p>
                      <p>Price: ${plan.price}</p>
                      <p>Sessions/Week: {plan.sessionsPerWeek}</p>
                      <p>Duration: {plan.durationWeeks} weeks</p>
                      <p>Status: {plan.isActive ? 'Active' : 'Inactive'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetPlansPage;