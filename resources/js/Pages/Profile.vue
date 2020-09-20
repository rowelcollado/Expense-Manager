<template>
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card card-widget widget-user">
                <div class="widget-user-header bg-info">
                    <h3 class="widget-user-username">{{this.form.name}}</h3>
                    <h5 class="widget-user-desc">({{this.form.role_id | upText}})</h5>
                </div>
                <div class="widget-user-image">
                    <img class="img-circle elevation-2" :src="getProfilePhoto()" alt="User Avatar">
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-sm-4 border-right">
                            <div class="description-block">
                                <h5 class="description-header">3,200</h5>
                                <span class="description-text">SALES</span>
                            </div>
                        </div>
                        <div class="col-sm-4 border-right">
                            <div class="description-block">
                                <h5 class="description-header">13,000</h5>
                                <span class="description-text">EXPENSE</span>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="description-block">
                                <h5 class="description-header">35</h5>
                                <span class="description-text">PRODUCTS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-12">
            <div class="card">
                <div class="card-header p-2">
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link" href="#expense" data-toggle="tab">Expense Management</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="#settings" data-toggle="tab">Settings</a>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <div class="tab-content">
                        <div class="tab-pane" id="expense">
                           
                        </div>

                        <div class="tab-pane active" id="settings">
                            <form class="form-horizontal">
                                <div class="form-group row">
                                    <label for="name" class="col-sm-2 col-form-label">Name :</label>
                                    <div class="col-sm-10">
                                        <input v-model="form.name" type="text" name="name" class="form-control" :class="{ 'is-invalid': form.errors.has('name') }" placeholder="Name">
                                        <has-error :form="form" field="name"></has-error>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="email" class="col-sm-2 col-form-label">Email Address :</label>
                                    <div class="col-sm-10">
                                        <input v-model="form.email" type="text" name="email" class="form-control" :class="{ 'is-invalid': form.errors.has('email') }" placeholder="Email Address">
                                        <has-error :form="form" field="email"></has-error>
                                    </div>
                                </div>
                                <!-- <div class="form-group row">
                                    <label for="role_id" class="col-sm-2 col-form-label">Role :</label>
                                    <div class="col-sm-10">
                                        <select v-model="form.role_id" name="role_id" id="role_id" class="form-control" :class="{ 'is-invalid': form.errors.has('role_id') }">
                                            <option value="">Select User Role</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                        <has-error :form="form" field="role_id"></has-error>
                                    </div>
                                </div> -->
                                <div class="form-group row">
                                    <label for="photo" class="col-sm-2 col-form-label">Profile Photo :</label>
                                    <div class="col-sm-10">
                                        <div class="custom-file">
                                            <input @change="updatePhoto" type="file" class="custom-file-input" id="exampleInputFile">
                                            <label class="custom-file-label" for="exampleInputFile">Choose file</label>
                                        </div>
                                    </div>
                                    <!-- <div class="col-sm-10">
                                        <input @change="updatePhoto" type="file" name="photo" id="photo" class="form-input">
                                    </div> -->
                                </div>
                                <div class="form-group row">
                                    <label for="password" class="col-sm-2 col-form-label">Password :</label>
                                    <div class="col-sm-10">
                                        <input v-model="form.password" type="password" name="password" class="form-control" :class="{ 'is-invalid': form.errors.has('password') }" placeholder="Password">
                                        <has-error :form="form" field="password"></has-error>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="offset-sm-2 col-sm-10">
                                        <button @click.prevent="updateProfile" type="submit" class="btn btn-success">Update</button>
                                    </div>
                                </div>
                            </form>
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
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    role_id: '',
                    photo: '',
                })
            }
        },

        methods: {
            getProfilePhoto(){
                let photo = (this.form.photo.length > 200) ? this.form.photo : "img/profile/"+ this.form.photo ;
                return photo;
            },

            updatePhoto(e) {
                let file = e.target.files[0];
                let reader = new FileReader();
                let limit = 1024 * 1024 * 2;
                if (file['size'] > limit) {
                    Swal.fire(
                        'error',
                        'Oops...',
                        'You are uploading a large file',
                    )
                    return false;
                } 

                reader.onloadend = (file) => {
                    // console.log('RESULT', reader.result);
                    this.form.photo = reader.result;
                }
                reader.readAsDataURL(file);
            },

            updateProfile() {
                this.$Progress.start();
                if(this.form.password == ''){
                    this.form.password = undefined;
                }
                this.form.put('api/profile').then(() => {
                    Swal.fire(
                        'Updated!',
                        'Your profile has been updated.',
                        'success'
                    )
                    Fire.$emit('AfterRequest');
                    this.$Progress.finish();
                    this.$router.push('/dashboard')
                }).catch(() => {
                    this.$Progress.fail();
                });
            },
        },

        created() {
            axios.get('api/profile').then(({ data }) => (this.form.fill(data)));
        },
    }
</script>
