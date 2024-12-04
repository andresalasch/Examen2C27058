<template>
  <header>
    <h1 class="card-title text-center">Máquina de café</h1>
  </header>
  <div class="machine">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow">
          <div class="card-body">
            <h2 class="h4 text-center mt-4">Cafés Disponibles</h2>
            <ul class="list-group list-group-flush">
              <li v-for="(coffee, type) in coffeeTypes" :key="type" class="list-group-item d-flex justify-content-between align-items-center">
                {{ type }} ({{ coffee.price }} CRC)
                <span class="spanType">Restantes: {{ coffee.quantity }} </span>
              </li>
            </ul>

            <h2 class="h4 text-center mt-4">Seleccionar Cafés</h2>
            <div v-for="(coffee, type) in coffeeTypes" :key="type" class="mb-3">
              <label class="form-label">{{ type }}</label>
              <input
                type="number"
                class="form-control"
                v-model.number="order[type]"
                min="0"
                :max="coffee.quantity"
                placeholder="Cantidad"
              />
            </div>
            <p class="text-center font-weight-bold">Total a pagar: {{ calculatePrice }} colones</p>

            <h2 class="h4 text-center mt-4">Ingresar Dinero</h2>
            <div class="mb-3">
              <input
                type="number"
                class="form-control"
                v-model.number="moneyInput"
                placeholder="Monto"
              />
            </div>

            <button @click="buyCoffees" class="btn btn-primary w-100">Comprar</button>

            <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
            <div v-if="change" class="mt-3">
              <h3 class="h5">Su vuelto es de {{ change.total }} colones.</h3>
              <ul class="list-group">
                <li v-for="(count, denomination) in change.breakdown" :key="denomination" class="list-group-item">
                  {{ count }} moneda(s) de {{ denomination }} colones
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      coffeeTypes: {
        Americano: { quantity: 10, price: 950 },
        Capuchino: { quantity: 8, price: 1200 },
        Latte: { quantity: 10, price: 1350 },
        Mocca: { quantity: 15, price: 1500 },
      },
      coins: {
        500: 20,
        100: 30,
        50: 50,
        25: 25,
      },
      order: {
        Americano: 0,
        Capuchino: 0,
        Latte: 0,
        Mocca: 0,
      },
      moneyInput: 0,
      error: null,
      change: null,
    };
  },
  mounted() {
    this.resetData();
  },
  computed: {
    calculatePrice() {
      return Object.keys(this.order).reduce(
        (total, type) => total + this.order[type] * this.coffeeTypes[type].price,
        0
      );
    },
  },
  methods: {
    resetData() {
      this.coffeeTypes = {
        Americano: { quantity: 10, price: 950 },
        Capuchino: { quantity: 8, price: 1200 },
        Latte: { quantity: 10, price: 1350 },
        Mocca: { quantity: 15, price: 1500 },
      };
      this.coins = {
        500: 20,
        100: 30,
        50: 50,
        25: 25,
      }
      this.order = {
        Americano: 0,
        Capuchino: 0,
        Latte: 0,
        Mocca: 0,
      }
      this.moneyInput = 0;
      this.error = null;
      this.change = null;
    },
    checkOrder() {
      for (let type in this.order) {
        if (this.order[type] > this.coffeeTypes[type].quantity) {
          this.error = `Solamente hay ${this.coffeeTypes[type].quantity} cafes de tipo ${type}`;
          return false;
        }
      }

      if (this.moneyInput < this.calculatePrice) {
        this.error = "No pagó lo suficiente";
        return false;
      }

      return true
    },
    buyCoffees() {
      this.error = null;
      this.change = null;
      
      if (this.checkOrder()) {
        for (let type in this.order) {
          this.coffeeTypes[type].quantity -= this.order[type];
        }

        const totalChange = this.moneyInput - this.calculatePrice;
        const coinList = this.getChange(totalChange);

        if (!coinList) {
          this.error = "No hay suficientes monedas para el vuelto";
          return;
        }

        this.changeCoinAmount(coinList);

        this.change = { total: totalChange, coinsUsed: coinList};
      }
    },
    getChange(amount) {
      const coinTypesList = Object.keys(this.coins).sort((a, b) => b - a);
      const coinsCount = {};
      var count;
      for (var cointType of coinTypesList) {
        count = Math.min(Math.floor(amount / cointType), this.coins[cointType]);
        if (count > 0) {
          coinsCount[cointType] = count;
          amount -= count * cointType;
        }
      }

      return amount === 0 ? coinsCount : null;
    },
    changeCoinAmount(coinList) {
      for (let denomination in coinList) {
        this.coins[denomination] -= coinList[denomination];
      }
    },
  },
};
</script>

<style scoped>
  
  html, body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  color: #333;
  height: 100%;
  justify-content: center;
  align-items: center;
  }

  .machine {
    background-color: burlywood;
  }

  .header{
    background-color: burlywood;
  }

  .card-body{
    background-color: rgba(255, 255, 224, 0.74);
  }

  .list-group list-group-flush{
    background-color: rgb(179, 165, 103);
  }

  .spanType {
    display: inline-block;
    width: 150px;
    text-align: left;
  }
  input.form-control {
    background-color: bisque;
  }

</style>
