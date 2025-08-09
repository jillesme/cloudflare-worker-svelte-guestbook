<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";

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

<div>
    {#each data.messages as message}
        <div class="message">
            <h3>{message.name} ({message.country})</h3>
            <p>{message.message}</p>
            <span class="date">Posted on {message.createdAt}</span>
        </div>
    {:else}
        <p>No messages yet</p>
    {/each}
</div>

<hr />

<form method="post" use:enhance>
    <div>
        <label for="name">Name</label>
        <input id="name" type="text" bind:value={name} name="name" />
    </div>
    <div>
        <label for="msg">Message</label>
        <textarea id="msg" bind:value={message} name="message"></textarea>
        <span class="count">{characterCount} characters</span>
    </div>
    <button type="submit" disabled={characterCount < 5}>Post</button>
</form>

<style>
    form div {
        margin-bottom: 1rem;
        max-width: 540px;
    }

    label {
        display: block;
        margin-bottom: 0.25rem;
    }

    input,
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
