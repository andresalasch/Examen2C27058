import { shallowMount } from '@vue/test-utils';
import MachineCentral from '../src/components/MachineCentral.vue';

describe('MachineCentral.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(MachineCentral);
  });

  it('fail when order > quantity', async () => {
    wrapper.setData({ order: { Americano: 11 } });
    wrapper.vm.buyCoffees();
    expect(wrapper.vm.error).toBe('No hay suficiente Americano');
  });

  it('quantity is reduced after buying', async () => {
    wrapper.setData({
      order: { Americano: 1, Mocca: 2 },
      moneyInput: 5000,
    });
    wrapper.vm.buyCoffees();
    expect(wrapper.vm.error).toBe(null);
    expect(wrapper.vm.coffeeTypes.Americano.quantity).toBe(9);
    expect(wrapper.vm.coffeeTypes.Mocca.quantity).toBe(13);
    });

  it('price is calculated correctly', () => {
    wrapper.setData({
      order: { Americano: 2, Capuchino: 1 },
    });

    const totalPrice = wrapper.vm.calculatePrice;
    expect(totalPrice).toBe(3100);
  });

  it('change is calculated correctly', async () => {
    wrapper.setData({
      order: { Americano: 2, Mocca: 1 },
      moneyInput: 4000,
    });

    wrapper.vm.buyCoffees();

    expect(wrapper.vm.change.total).toBe(600);
    expect(wrapper.vm.change.coinsUsed[500]).toBe(1);
    expect(wrapper.vm.change.coinsUsed[100]).toBe(1);
  });
});
