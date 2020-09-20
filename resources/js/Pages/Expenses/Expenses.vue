<template>
    <div class="row">
        <div class="col-12" v-if="$gate.isAdmin()">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Expense Table</h3>

                    <div class="card-tools">
                        <button class="btn btn-success" @click="addExpenseModal()">
                            <i class="fas fa-user-plus"></i>
                            Add New Expense
                        </button>
                    </div>
                </div>
                <div class="card-body table-responsive p-0">
                    <table class="table table-hover text-center">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Expense Name</th>
                                <th>Expense Category</th>
                                <th>Amount</th>
                                <th>Created At</th>
                                <th>Modify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="expense in expenses.data" :key="expense.id">
                                <td>{{expense.id}}</td>
                                <td>{{expense.ExpenseName}}</td>
                                <td>{{expense.category_id}}</td>
                                <td>{{expense.amount | Peso}}</td>
                                <td>{{expense.created_at | myDate}}</td>
                                <td>
                                    <a href="#" class="btn btn-primary" @click="editExpense(expense)">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </a>
                                    <a href="#" class="btn btn-danger" @click="deleteExpense(expense.id)">
                                        <i class="fas fa-trash"></i>
                                        Delete
                                    </a>
                                </td>
                            </tr>
                            <tr v-if="total">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <span>
                                        <b>TOTAL : {{total | Peso}}</b>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer">
                    <paginations align="center" :data="expenses" @pagination-change-page="getResults"></paginations>
                </div>
            </div>
        </div>

        <div class="col-12" v-else>
            <div class="error-page">
                <h2 class="headline text-danger">403</h2>

                <div class="error-content">
                    <h3><i class="fas fa-exclamation-triangle text-danger"></i> Forbidden.</h3>

                    <p>
                        Sorry, you are not authorize to see this page. Please click the button below.
                    </p>
                    <router-link to="/dashboard" class="btn btn-primary">Back to Dashbaord</router-link>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add New Expense</h5>
                        <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update Expense</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <!-- FORM -->
                    <form @submit.prevent="editMode ? updateExpense() : createExpense()">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Expense Name :</label>
                                <input v-model="form.ExpenseName" type="text" name="ExpenseName" class="form-control" :class="{ 'is-invalid': form.errors.has('ExpenseName') }">
                                <has-error :form="form" field="ExpenseName"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Expense Category :</label>
                                <select v-model="form.category_id" name="category_id" id="category_id" class="form-control" :class="{ 'is-invalid': form.errors.has('category_id') }">
                                    <option value="">Select Category</option>
                                    <option v-for="category in expenseCategories" :key="category.id" :value="category.CategoryName">{{category.CategoryName}}</option>
                                </select>
                                <has-error :form="form" field="category_id"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Amount :</label>
                                <input v-model="form.amount" type="text" name="amount" class="form-control" :class="{ 'is-invalid': form.errors.has('amount') }">
                                <has-error :form="form" field="amount"></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button v-show="!editMode" type="submit" class="btn btn-success">Create</button>
                            <button v-show="editMode" type="submit" class="btn btn-success">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                editMode: false,
                expenses: {},
                expenseCategories: {},
                form: new Form({
                    id: '',
                    ExpenseName: '',
                    category_id: '',
                    amount: 0,
                })
            }
        },

        methods: {
            getResults(page = 1) {
                axios.get('api/expenses?page=' + page).then(response => {
                    this.expenses = response.data;
                });
            },

            addExpenseModal() {
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },

            editExpense(expense) {
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(expense);
            },

            loadExpenses() {
                if (this.$gate.isAdmin()) {
                    axios.get('api/expenses').then(({data}) => (this.expenses = data));  
                } 
            },

            loadExpenseCategory() {
                if (this.$gate.isAdmin()) {
                    axios.get('api/allCategories').then(({data}) => (this.expenseCategories = data));  
                } 
            },

            createExpense() {
                this.$Progress.start();
                this.form.post("api/expenses").then(() => {
                    Fire.$emit('AfterRequest');
                    $('#addNew').modal('hide');
                    Toast.fire({
                        icon: 'success',
                        title: 'Expense Created'
                    });
                    this.$Progress.finish();
                }).catch((err) => {
                    this.$Progress.fail();
                    Swal.fire(
                        'Error!',
                        `${err}`,
                        'warning'
                    )
                });
            },

            updateExpense(id) {
                this.$Progress.start();
                this.form.put('api/expenses/'+this.form.id).then(() => {
                    Fire.$emit('AfterRequest');
                    $('#addNew').modal('hide');
                    Swal.fire(
                        'Updated!',
                        'Expense has been updated.',
                        'success'
                    )
                    this.$Progress.finish();
                }).catch((err) => {
                    this.$Progress.fail();
                    Swal.fire(
                        'Error!',
                        `${err}`,
                        'warning'
                    )
                });
            },

            deleteExpense(id) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Send request to the server
                        this.form.delete('api/expenses/'+id).then(() => {
                            Swal.fire(
                                'Deleted!',
                                'Expense has been deleted.',
                                'success'
                            )
                            Fire.$emit('AfterRequest');
                        }).catch((err) => {
                            Swal.fire(
                                'Error!',
                                `${err}`,
                                'warning'
                            )
                        });
                    }
                })
            },
        },

        created() {
            this.loadExpenses();
            this.loadExpenseCategory()
            Fire.$on('AfterRequest', () => {
                this.loadExpenses();
            });
        },

        computed: {
            total: function() {
                let amountExpense = this.expenses.data.map(expense => {
                    return expense.amount;
                });

                if (amountExpense && amountExpense.length) {
                    return amountExpense.reduce((total, num) => {
                        return total + num;
                    });
                } else {
                    return null;
                }
            }
        }
    }
</script>
