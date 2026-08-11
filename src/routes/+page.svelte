<script lang="ts">
  import { onMount } from 'svelte';
  import { APP_PAGES, NAV_PAGES, type PageType } from '../types';
  import FormPage from '../lib/components/FormPage.svelte';
  import ListPage from '../lib/components/ListPage.svelte';
  import DetailPage from '../lib/components/DetailPage.svelte';
  import PreviewPage from '../lib/components/PreviewPage.svelte';
  import StatPage from '../lib/components/StatPage.svelte';
  import { getApplyList } from '../store';

  let page: PageType = 'form';
  let params: Record<string, any> = {};
  let list = getApplyList();

  function go(pageType: PageType, payload: Record<string, string> = {}) {
    page = pageType;
    params = payload;
    if (page === 'list') {
      list = getApplyList();
    }
  }

  function parseQuery() {
    const search = new URLSearchParams(window.location.search);
    const pageFromQuery = search.get('page') as PageType | null;
    const id = search.get('id');
    if (pageFromQuery && APP_PAGES.includes(pageFromQuery)) {
      page = pageFromQuery;
      params = id ? { id } : {};
    }
  }

  onMount(() => {
    parseQuery();
  });
</script>

<div class="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
  <main class="mx-auto max-w-5xl rounded-[32px] bg-white p-8 shadow-soft border border-slate-200">
    <header class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 text-xl font-bold text-white">加</div>
        <div>
          <h1 class="text-2xl font-semibold text-slate-950">加班申请流程系统</h1>
          <p class="text-sm text-slate-500">使用 SvelteKit + Tailwind 简化 UI 与逻辑。</p>
        </div>
      </div>
      <nav class="flex flex-wrap gap-3">
        {#each NAV_PAGES as p}
          <button
            class="rounded-2xl px-4 py-2 text-sm font-semibold transition {page === p ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
            on:click={() => go(p)}
          >
            {p === 'form' ? '发起申请' : p === 'list' ? '申请列表' : '统计报表'}
          </button>
        {/each}
      </nav>
    </header>

    {#if page === 'form'}
      <FormPage prefill={params.prefill} on:navigate={(e) => go(e.detail.page, e.detail.payload)} />
    {:else if page === 'preview'}
      <PreviewPage formData={params.formData} on:navigate={(e) => go(e.detail.page, e.detail.payload)} />
    {:else if page === 'list'}
      <ListPage on:navigate={(e) => go(e.detail.page, e.detail.payload)} />
    {:else if page === 'detail'}
      <DetailPage id={params.id} on:navigate={(e) => go(e.detail.page, e.detail.payload)} />
    {:else if page === 'stat'}
      <StatPage />
    {/if}
  </main>
</div>
