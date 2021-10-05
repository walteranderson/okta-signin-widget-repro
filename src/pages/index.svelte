<script>
  import { url } from "@roxi/routify";
  import SigninWidget from "../components/signin-widget.svelte";
</script>

<a href="{$url('./signin')}">Sign In</a>
<hr />

<SigninWidget />
