<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12" >
                <div class="error-page">
                    <h2 class="headline text-danger">404</h2>

                    <div class="error-content">
                        <h3><i class="fas fa-exclamation-triangle text-danger"></i> Oops! Page not found.</h3>

                        <p>
                            We could not find the page you were looking for. Meanwhile, you may return to dashboard by clicking the button below.
                        </p>
                        <router-link to="/dashboard" class="btn btn-primary">Back to Dashboard</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
