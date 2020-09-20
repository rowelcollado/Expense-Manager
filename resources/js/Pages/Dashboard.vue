<template>
    <div>
        <div class="row">
            <div class="col-lg-4 col-6">
                <div class="small-box bg-info">
                    <div class="inner">
                        <h3>{{categories.length}}</h3>

                        <p>Expense Categories</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <router-link to="/expenseCategory" class="small-box-footer">
                        More info 
                        <i class="fas fa-arrow-circle-right"></i>
                    </router-link>
                </div>
            </div>

            <div class="col-lg-4 col-6">
                <div class="small-box bg-success">
                    <div class="inner">
                        <h3>{{expenses.length}}</h3>

                        <p>Expenses</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <router-link to="/expense" class="small-box-footer">
                        More info 
                        <i class="fas fa-arrow-circle-right"></i>
                    </router-link>
                </div>
            </div>

            <div class="col-lg-4 col-6">
                <div class="small-box bg-orange">
                    <div class="inner white">
                        <h3>{{users.length}}</h3>

                        <p>Users</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <router-link to="/users" class="small-box-footer">
                        More info 
                        <i class="fas fa-arrow-circle-right"></i>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="card card-default">
            <div class="card-header">
                <h3 class="card-title">Pie Chart</h3>

                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                    <!-- <button type="button" class="btn btn-tool" data-card-widget="remove">
                        <i class="fas fa-times"></i>
                    </button> -->
                </div>
            </div>
            <div class="card-body">
                <div class="chart">
                    <my-chart :data="CategoryName" :option="TotalPerCategory">as</my-chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MyChart from './MyChart'

    export default {
        components: { 
            MyChart 
        },

        data() {
            return {
                users: {},
                categories: {},
                expenses: {},
            }
        },

        methods: {

        },

        created() {
            axios.get('api/allUsers').then(({data}) => (this.users = data));
            axios.get('api/allExpenses').then(({data}) => (this.expenses = data));
            axios.get('api/allCategories').then(({data}) => (this.categories = data));
        },

        computed: {
            CategoryName: function() {
                let setName = this.categories.map(value => {
                    return value.CategoryName;
                });
                return setName.sort();
            },

            ExpenseAmount: function() {
                let setAmount = this.expenses.map(value => {
                    return value.amount;
                });
                return setAmount;
            },

            TotalPerCategory: function() {
                let categories = this.expenses.map(value => {
                    return value.category_id;
                }).sort();

                var arr = [];
                var current = null;
                var count = 0;
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i] != current) {
                        if (count > 0) {
                            arr.push(count)
                        }
                        current = categories[i];
                        count = 1;
                    } else {
                        count++;
                    }
                }
                if (count > 0) {
                    arr.push(count)
                }
                return arr;
            }
        }
    }
</script>

<style>
.chart {
    max-width: 600px;
    margin:  25px auto;
}
</style>
