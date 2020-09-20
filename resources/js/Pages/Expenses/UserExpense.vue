<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Expense Table</h3>

                    <div class="card-tools">
                        <button class="btn btn-success" @click="addModal()">
                            <i class="fas fa-cart-plus"></i>
                            Add Expense
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
                            <tr v-for="item in userExpenses.data" :key="item.id">
                                <td>{{item.id}}</td>
                                <td>{{item.expense_id}}</td>
                                <td>{{item.category_id}}</td>
                                <td>{{item.amount | Peso}}</td>
                                <td>{{item.created_at | myDate}}</td>
                                <td>
                                    <a href="#" class="btn btn-primary" @click="editExpense(item)">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </a>
                                    <a href="#" class="btn btn-danger" @click="deleteExpense(item.id)">
                                        <i class="fas fa-trash"></i>
                                        Delete
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer">
                    <paginations align="center" :data="userExpenses" @pagination-change-page="getResults"></paginations>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add Expense</h5>
                        <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update Expense</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <form @submit.prevent="editMode ? updateExpense() : createExpense()">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Category :</label>
                                <select v-model="category" @change="selectedCategory" name="category" id="category" class="form-control">
                                    <option value="" disabled>Select Category</option>
                                    <option v-for="category in expenseCategories" :key="category.id" :value="category.CategoryName">{{category.CategoryName}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Expense :</label>
                                <select v-model="form.expense_id" @change="selectedExpense" name="expense_id" id="expense_id" class="form-control" :class="{ 'is-invalid': form.errors.has('expense_id') }">
                                    <option value="" disabled>Select Expense</option>
                                    <option v-for="option in filteredExpenses" :key="option.id" :value="option.ExpenseName">{{option.ExpenseName}}</option>
                                </select>
                                <has-error :form="form" field="expense_id"></has-error>
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
                userExpenses: {},
                expenseCategories: {},
                expenses: {},

                category: '',
                filteredExpenses: {},
                form: new Form({
                    id: '',
                    expense_id: '',
                    category_id: '',
                    amount: '',
                })
            }
        },

        methods: {
            selectedExpense() {
                let filteredAmount = this.expenses.filter((expense) => {
                    return expense.ExpenseName == this.form.expense_id;
                });

                this.form.amount = filteredAmount[0].amount;
            },

            selectedCategory() {
                this.form.category_id = this.category;
                this.form.expense_id = '';
                this.filteredExpenses = this.expenses.filter((expense) => {
                    return expense.category_id == this.category;
                });
            },

            getResults(page = 1) {
                axios.get('api/user-expenses?page=' + page).then(response => {
                    this.userExpenses = response.data;
                });
            },

            addModal() {
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },

            editExpense(item) {
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');

                this.category = item.category_id;
                this.filteredExpenses = this.expenses.filter((expense) => {
                    return expense.category_id == this.category;
                });
                this.form.fill(item);
            },

            loadUserExpenses() {
                axios.get('api/user-expenses').then(({data}) => (this.userExpenses = data));  
            },

            loadExpenseCategory() {
                axios.get('api/allCategories').then(({data}) => (this.expenseCategories = data));  
            },

            loadExpenses() {
                axios.get('api/allExpenses').then(({data}) => (this.expenses = data));
            },

            createExpense() {
                this.$Progress.start();
                this.form.post("api/user-expenses").then(() => {
                    Fire.$emit('AfterRequest');
                    $('#addNew').modal('hide');
                    Toast.fire({
                        icon: 'success',
                        title: 'Expense Added'
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
                this.form.put('api/user-expenses/'+this.form.id).then(() => {
                    Fire.$emit('AfterRequest');
                    $('#addNew').modal('hide');
                    Swal.fire(
                        'Updated!',
                        'Your Expense has been updated.',
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
                        this.form.delete('api/user-expenses/'+id).then(() => {
                            Swal.fire(
                                'Deleted!',
                                'Your Expense has been deleted.',
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
            this.loadUserExpenses();
            this.loadExpenseCategory();
            this.loadExpenses();
            Fire.$on('AfterRequest', () => {
                this.loadUserExpenses();
            });
        },
    }
</script>
