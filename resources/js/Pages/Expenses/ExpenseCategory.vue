<template>
    <div class="row">
        <div class="col-12" v-if="$gate.isAdmin()">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Expense Category Table</h3>

                    <div class="card-tools">
                        <button class="btn btn-success" @click="addCategoryModal()">
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
                                <th>Expense Category</th>
                                <th>Created At</th>
                                <th>Modify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="category in expenseCategories.data" :key="category.id">
                                <td>{{category.id}}</td>
                                <td>{{category.CategoryName}}</td>
                                <td>{{category.created_at | myDate}}</td>
                                <td>
                                    <a href="#" class="btn btn-primary" @click="editCategory(category)">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </a>
                                    <a href="#" class="btn btn-danger" @click="deleteCategory(category.id)">
                                        <i class="fas fa-trash"></i>
                                        Delete
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer">
                    <paginations align="center" :data="expenseCategories" @pagination-change-page="getResults"></paginations>
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
                        <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add New Expense Category</h5>
                        <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update Expense Category</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <!-- FORM -->
                    <form @submit.prevent="editMode ? updateCategory() : createCategory()">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Expense Category Name :</label>
                                <input v-model="form.CategoryName" type="text" name="CategoryName" class="form-control" :class="{ 'is-invalid': form.errors.has('CategoryName') }">
                                <has-error :form="form" field="CategoryName"></has-error>
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
                expenseCategories: {},
                form: new Form({
                    id: '',
                    CategoryName: '',
                })
            }
        },

        methods: {
            getResults(page = 1) {
                axios.get('api/categories?page=' + page).then(response => {
                    this.expenseCategories = response.data;
                });
            },

            addCategoryModal() {
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },

            editCategory(category) {
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(category);
            },

            loadExpenseCategory() {
                if (this.$gate.isAdmin()) {
                    axios.get('api/categories').then(({data}) => (this.expenseCategories = data));  
                } 
            },

            createCategory() {
                this.$Progress.start();
                this.form.post("api/categories").then(() => {
                    Fire.$emit('AfterRequest');
                    $('#addNew').modal('hide');
                    Toast.fire({
                        icon: 'success',
                        title: 'Expense Category Created'
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

            updateCategory(id) {
                this.$Progress.start();
                this.form.put('api/categories/'+this.form.id).then(() => {
                    Fire.$emit('AfterRequest');
                    $('#addNew').modal('hide');
                    Swal.fire(
                        'Updated!',
                        'Information has been updated.',
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

            deleteCategory(id) {
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
                        this.form.delete('api/categories/'+id).then(() => {
                            Swal.fire(
                                'Deleted!',
                                'Expense Category has been deleted.',
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
            }
        },

        created() {
            this.loadExpenseCategory();
            Fire.$on('AfterRequest', () => {
                this.loadExpenseCategory();
            });
        }
    }
</script>
