<script lang="ts">
    import { authClient } from '$lib/auth-client';

    async function loginWithGoogle() {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
            errorCallbackURL: "/",
            newUserCallbackURL: "/",
        });
    }
</script>

<h1>
    Login
</h1>

<button onclick={loginWithGoogle}>
    Login with Google
</button>