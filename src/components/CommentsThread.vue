<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import commentsService, { type CommentItem } from '@/services/comments.service'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  courseId: { type: [String, Number], required: true },
  lectureId: { type: [String, Number], required: true },
  videoId: { type: [String, Number], required: false },
})

const userStore = useUserStore()
const loading = ref(false)
const error = ref('')
const items = ref<CommentItem[]>([])
const total = ref(0)
const page = ref(1)
const per = ref(20)
const content = ref('')
const posting = ref(false)

const userId = computed(() => {
  if (!userStore.id) userStore.hydrate()
  const uid = userStore.id
  return typeof uid === 'number' ? String(uid) : (uid || '')
})

async function fetchComments() {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, unknown> = {
      courseId: Number(props.courseId),
      lectureId: Number(props.lectureId),
      page: page.value,
      per: per.value,
    }
    if (props.videoId !== undefined) params.videoId = Number(props.videoId)
    const { data } = await commentsService.list(params)
    items.value = Array.isArray((data as any)?.items) ? (data as any).items : []
    total.value = Number((data as any)?.total || 0)
  } catch (e: any) {
    error.value = e?.message || 'Error al obtener comentarios'
  } finally {
    loading.value = false
  }
}

function hasLiked(c: CommentItem): boolean {
  const likes = (c.likes || []) as string[]
  const uid = userId.value
  return !!likes.find(l => String(l) === String(uid))
}

async function toggleLike(c: CommentItem) {
  if (!userId.value || !c || !c._id && !c.id) return
  const id = String(c._id || c.id)
  try {
    if (hasLiked(c)) {
      await commentsService.unlike(id, userId.value)
      c.likes = (c.likes || []).filter((l: any) => String(l) !== String(userId.value))
    } else {
      await commentsService.like(id, { userId: userId.value })
      c.likes = [ ...(c.likes || []), userId.value ]
    }
  } catch {}
}

async function submit() {
  if (!userId.value || !content.value.trim()) return
  posting.value = true
  error.value = ''
  try {
    const body = {
      userId: userId.value,
      content: content.value.trim(),
      parentId: null,
      courseId: Number(props.courseId),
      lectureId: Number(props.lectureId),
      videoId: props.videoId !== undefined ? Number(props.videoId) : undefined,
    }
    await commentsService.create(body)
    content.value = ''
    await fetchComments()
  } catch (e: any) {
    error.value = e?.message || 'No se pudo publicar el comentario'
  } finally {
    posting.value = false
  }
}

onMounted(fetchComments)
</script>

<template>
  <div class="comments">
    <h3 class="title"><i class="fa-regular fa-comments" /> Comentarios</h3>
    <div v-if="loading" class="state"><i class="fa-solid fa-spinner fa-spin" /> Cargando comentarios...</div>
    <div v-else-if="error" class="state error"><i class="fa-solid fa-triangle-exclamation" /> {{ error }}</div>

    <div class="composer">
      <textarea v-model="content" class="input" rows="3" placeholder="Escribe tu comentario"></textarea>
      <button class="send" :disabled="posting || !content.trim()" @click="submit">
        <i class="fa-solid fa-paper-plane" /> Publicar
      </button>
    </div>

    <ul class="list" v-if="items.length">
      <li v-for="c in items" :key="c._id || c.id" class="item">
        <p class="content">{{ c.content }}</p>
        <div class="actions">
          <button class="like" @click="toggleLike(c)">
            <i :class="hasLiked(c) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" />
            {{ (c.likes || []).length || 0 }}
          </button>
        </div>
      </li>
    </ul>
    <div v-else class="empty"><i class="fa-regular fa-comment" /> Sé el primero en comentar.</div>
  </div>
</template>

<style lang="scss" scoped>
.comments { display: grid; gap: 12px; }
.title { color: $FUDMASTER-DARK; font-size: 18px; margin: 0; display: inline-flex; align-items: center; gap: 8px; }
.state { display: inline-flex; align-items: center; gap: 8px; color: #555; }
.state.error { color: $alert-error; }
.composer { display: grid; gap: 8px; }
.input { width: 100%; resize: vertical; padding: 10px; border-radius: 8px; border: 1px solid #ddd; font-family: inherit; }
.send { align-self: end; background: $FUDMASTER-GREEN; color: $white; border: none; border-radius: 8px; padding: 8px 12px; cursor: pointer; }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.item { background: $white; border: 1px solid #e6e6e6; border-radius: 10px; padding: 10px; display: grid; gap: 8px; }
.content { color: #333; margin: 0; }
.actions { display: inline-flex; align-items: center; gap: 10px; }
.like { background: none; border: none; color: #e74c3c; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
@media (max-width: 600px) { .input { font-size: 14px; } }
</style>
