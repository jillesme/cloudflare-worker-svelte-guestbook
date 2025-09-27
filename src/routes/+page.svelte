<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import { authClient } from "$lib/auth-client";
    import { invalidateAll } from "$app/navigation";

    let { data }: PageProps = $props();

    let name = $state("");
    let message = $state("");
    let characterCount = $derived(message.length);
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
    documentation
</p>

{#if data.session?.user}
    <img src={data.session.user.image} alt={data.session.user.name} />
    Hello {data.session.user.name}
    <button onclick={async () => { await authClient.signOut(); invalidateAll() }}>Logout</button>
{:else}
    <a href="/login">Login</a>
{/if}

<div>
    {#each data.messages as message}
        <div class="message">
            <h3>{message.user.name} ({message.guestbook_messages.country})</h3>
            <p>{message.guestbook_messages.message}</p>
            <span class="date">Posted on {message.guestbook_messages.createdAt}</span>
        </div>
    {:else}
        <p>No messages yet</p>
    {/each}
</div>

<hr />

{#if !data.session?.user}
    <p>You must be logged in to post a message</p>
    <a href="/login">Login</a>
    <hr />
{:else}
<form method="post" use:enhance>
    <div>
        <label for="msg">Message</label>
        <textarea id="msg" bind:value={message} name="message"></textarea>
        <span class="count">{characterCount} characters</span>
    </div>
    <button type="submit" disabled={characterCount < 5}>Post</button>
</form>
{/if}

<style>
    form div {
        margin-bottom: 1rem;
        max-width: 540px;
    }

    label {
        display: block;
        margin-bottom: 0.25rem;
    }

    textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
    }

    hr {
        margin: 2rem 0;
        border: 0;
        border-top: 1px solid #eee;
    }

    .message {
        margin: 1rem 0;
        padding-bottom: 1rem;
    }

    .date,
    .count {
        color: #777;
        font-size: 0.9rem;
    }
</style>
