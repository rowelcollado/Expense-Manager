<template>
    <div class="row">
        <div class="col-12" v-if="$gate.isAdmin()">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Users Table</h3>

                    <div class="card-tools">
                        <button class="btn btn-success" @click="addModal()">
                            <i class="fas fa-user-plus"></i>
                            Add New User
                        </button>
                    </div>
                </div>
                <div class="card-body table-responsive p-0">
                    <table class="table table-hover text-center">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Registered At</th>
                                <th>Modify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users.data" :key="user.id">
                                <td>{{user.id}}</td>
                                <td>{{user.name}}</td>
                                <td>{{user.email}}</td>
                                <td>{{user.role_id | upText}}</td>
                                <td>{{user.created_at | myDate}}</td>
                                <td>
                                    <a href="#" class="btn btn-primary" @click="editModal(user)">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </a>
                                    <a href="#" class="btn btn-danger" @click="deleteUser(user.id)">
                                        <i class="fas fa-trash"></i>
                                        Delete
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer">
                    <paginations align="center" :data="users" @pagination-change-page="getResults"></paginations>
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
                    <router-link to="/dashboard" class="btn btn-primary">Back to Dashboard</router-link>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add New User</h5>
                        <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <!-- FORM -->
                    <form @submit.prevent="editMode ? updateUser() : createUser()">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Name :</label>
                                <input v-model="form.name" type="text" name="name" class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Email Address:</label>
                                <input v-model="form.email" type="text" name="email" class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Role :</label>
                                <select v-model="form.role_id" name="role_id" id="role_id" class="form-control" :class="{ 'is-invalid': form.errors.has('role_id') }">
                                    <option value="">Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                                <has-error :form="form" field="role_id"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Password :</label>
                                <input v-model="form.password" type="password" name="password" class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
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
                users: {},
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    role_id: '',
                    photo: 'avatar5.png',
                })
            }
        },

        methods: {
            getResults(page = 1) {
                axios.get('api/user?page=' + page).then(response => {
                    this.users = response.data;
                });
            },

            addModal() {
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },

            editModal(user) {
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);
            },

            loadUsers() {
                if (this.$gate.isAdmin()) {
                    axios.get('api/user').then(({data}) => (this.users = data));  
                } 
            },

            createUser() {
                this.$Progress.start();
                this.form.post('api/user').then(() => {
                    Fire.$emit('AfterRequest');
                    $('#addNew').modal('hide');
                    Toast.fire({
                        icon: 'success',
                        title: 'User Successfully Created'
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

            updateUser(id) {
                this.$Progress.start();
                this.form.put('api/user/'+this.form.id).then(() => {
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

            deleteUser(id) {
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
                        this.form.delete('api/user/'+id).then(() => {
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
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
            this.loadUsers();
            Fire.$on('AfterRequest', () => {
                this.loadUsers();
            });
            // setInterval(() => this.loadUsers(), 3000);
        }
    }
</script>
