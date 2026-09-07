<script setup>
import { ref, onMounted, onUnmounted, markRaw, nextTick } from "vue";
import { AlphaTabApi } from "@coderline/alphatab";
import Fretboard from "./components/Fretboard.vue";

const alphaTabContainer = ref(null);
const headerElement = ref(null);
const fileInput = ref(null);
let api = null;

const isPlaying = ref(false);
const playbackSpeed = ref(100);
const isReady = ref(false);
const activeNotes = ref([]);
const currentFileName = ref("Esperando archivo...");
const errorMessage = ref("");

const viewMode = ref("horizontal");
const paypalUrl = "https://paypal.me/tu_usuario_paypal";

const updateScrollOffset = () => {
  if (api && headerElement.value && alphaTabContainer.value) {
    const headerHeight = headerElement.value.offsetHeight;
    if (headerHeight > 0) {
      api.settings.player.scrollOffsetY = -headerHeight - 15;
    }
  }
};

onMounted(() => {
  try {
    if (!alphaTabContainer.value) return;

    // Inicialización del motor de AlphaTab
    const alphaInstance = new AlphaTabApi(alphaTabContainer.value, {
      file: "https://www.alphatab.net/files/canon.gp",
      player: {
        enablePlayer: true,
        enableCursor: true,
        soundFont: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@1.3.0/dist/soundfont/sonivox.sf2",
      },
      display: {
        staveProfile: "ScoreTab",
      },
    });

    api = markRaw(alphaInstance);

    api.scoreLoaded.on(() => {
      isReady.value = true;
      errorMessage.value = "";
      currentFileName.value = "Canon in D (Demo)";
      updateScrollOffset();
    });

    api.error.on((err) => {
      console.error("AlphaTab Error:", err);
      errorMessage.value = "Presiona '📂 Cargar' para seleccionar una tablatura de tu equipo.";
      isReady.value = true;
    });

    api.playedBeatChanged.on((beat) => {
      if (beat) {
        updateNotesFromBeat(beat);
      }
    });

    api.beatMouseDown.on((beat) => {
      if (beat) {
        updateNotesFromBeat(beat);
      }
    });

    api.playerStateChanged.on((e) => {
      isPlaying.value = e.state === 1;
      if (e.state === 0) {
        activeNotes.value = [];
      }
    });
  } catch (err) {
    console.error("Error crítico al inicializar AlphaTab:", err);
    errorMessage.value = "No se pudo iniciar el motor visual. Intenta recargar la página.";
    isReady.value = true;
  }

  window.addEventListener("resize", updateScrollOffset);
});

const updateNotesFromBeat = (beat) => {
  if (!beat || !beat.notes || beat.notes.length === 0) {
    activeNotes.value = [];
    return;
  }

  const notesList = [];
  beat.notes.forEach((n) => {
    notesList.push({ string: n.string, fret: n.fret });
  });

  activeNotes.value = notesList;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  errorMessage.value = "";
  currentFileName.value = file.name;
  isReady.value = false;

  const reader = new FileReader();

  reader.onerror = () => {
    errorMessage.value = "Error al abrir el archivo local.";
    isReady.value = true;
  };

  reader.onload = (e) => {
    try {
      const arrayBuffer = e.target.result;
      if (api && arrayBuffer) {
        api.load(new Uint8Array(arrayBuffer));
      }
    } catch (err) {
      console.error("Error al cargar archivo:", err);
      errorMessage.value = "Formato no compatible o archivo dañado.";
      isReady.value = true;
    }
  };

  reader.readAsArrayBuffer(file);
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const changeViewMode = async (mode) => {
  viewMode.value = mode;
  await nextTick();

  requestAnimationFrame(() => {
    if (api && alphaTabContainer.value) {
      const containerWidth = alphaTabContainer.value.offsetWidth;
      if (containerWidth > 0) {
        updateScrollOffset();
        api.updateSettings();
        api.render();
      }
    }
  });
};

onUnmounted(() => {
  window.removeEventListener("resize", updateScrollOffset);
  if (api) {
    api.destroy();
  }
});

const togglePlay = () => {
  if (api) {
    if (api.player) {
      api.player.playPause();
    }
  }
};

const changeSpeed = (e) => {
  const speed = parseFloat(e.target.value);
  playbackSpeed.value = Math.round(speed * 100);
  if (api) {
    api.playbackSpeed = speed;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
    
    <!-- HEADER -->
    <header ref="headerElement" class="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 shadow-2xl">
      <div class="max-w-7xl mx-auto flex flex-col items-center gap-2 sm:gap-3">
        
        <div class="w-full flex flex-wrap justify-between items-center gap-2 border-b border-slate-800/80 pb-2">
          
          <div class="flex items-center gap-2.5">
            <div class="p-1.5 bg-slate-950 border border-slate-800 rounded-xl shadow-inner flex items-center justify-center">
              <svg class="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 60L22 46C22 44 20 40 18 36L14 26C12 22 14 10 24 8L32 6L40 8C50 10 52 22 50 26L46 36C44 40 42 44 42 46L42 60" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="20" y="52" width="24" height="3" rx="1.5" fill="#E2E8F0"/>
                <line x1="24" y1="52" x2="24" y2="28" stroke="#94A3B8" stroke-width="1"/>
                <line x1="27" y1="52" x2="27" y2="20" stroke="#94A3B8" stroke-width="1"/>
                <line x1="30" y1="52" x2="30" y2="12" stroke="#94A3B8" stroke-width="1"/>
                <line x1="34" y1="52" x2="34" y2="12" stroke="#94A3B8" stroke-width="1"/>
                <line x1="37" y1="52" x2="37" y2="20" stroke="#94A3B8" stroke-width="1"/>
                <line x1="40" y1="52" x2="40" y2="28" stroke="#94A3B8" stroke-width="1"/>
                <circle cx="10" cy="18" r="3" fill="#10B981"/>
                <line x1="13" y1="18" x2="19" y2="18" stroke="#34D399" stroke-width="2"/>
                <circle cx="8" cy="28" r="3" fill="#10B981"/>
                <line x1="11" y1="28" x2="18" y2="28" stroke="#34D399" stroke-width="2"/>
                <circle cx="10" cy="38" r="3" fill="#10B981"/>
                <line x1="13" y1="38" x2="17" y2="38" stroke="#34D399" stroke-width="2"/>
                <circle cx="54" cy="18" r="3" fill="#10B981"/>
                <line x1="51" y1="18" x2="45" y2="18" stroke="#34D399" stroke-width="2"/>
                <circle cx="56" cy="28" r="3" fill="#10B981"/>
                <line x1="53" y1="28" x2="46" y2="28" stroke="#34D399" stroke-width="2"/>
                <circle cx="54" cy="38" r="3" fill="#10B981"/>
                <line x1="51" y1="38" x2="47" y2="38" stroke="#34D399" stroke-width="2"/>
              </svg>
            </div>
            <div>
              <h1 class="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                TabEngine
              </h1>
              <p class="text-[10px] sm:text-xs text-slate-400">Práctica e interacción dinámica de tablaturas</p>
            </div>
          </div>

          <div class="flex items-center gap-1.5 sm:gap-2">
            <div class="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] sm:text-xs">
              <button 
                @click="changeViewMode('horizontal')"
                class="px-2 py-1 rounded transition cursor-pointer font-medium"
                :class="viewMode === 'horizontal' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'"
              >
                Horizontal
              </button>
              <button 
                @click="changeViewMode('split')"
                class="px-2 py-1 rounded transition cursor-pointer font-medium"
                :class="viewMode === 'split' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'"
              >
                Split (Vertical)
              </button>
              <button 
                @click="changeViewMode('tab-only')"
                class="px-2 py-1 rounded transition cursor-pointer font-medium"
                :class="viewMode === 'tab-only' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'"
              >
                Solo Tab
              </button>
            </div>

            <a 
              :href="paypalUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-2.5 py-1 sm:py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition"
            >
              <span>☕ Donar</span>
            </a>
          </div>
        </div>

        <div v-if="viewMode === 'horizontal'" class="w-full">
          <Fretboard :active-notes="activeNotes" orientation="horizontal" />
        </div>

        <div v-if="errorMessage" class="w-full max-w-5xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] px-3 py-1.5 rounded-lg text-center font-medium">
          ℹ️ {{ errorMessage }}
        </div>

        <div class="bg-slate-800/90 px-3 sm:px-4 py-2 rounded-xl flex flex-wrap items-center justify-between gap-2.5 border border-slate-700 w-full max-w-5xl shadow-md">
          
          <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button 
              @click="togglePlay"
              :disabled="!isReady"
              class="px-3.5 py-1.5 sm:py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow"
              :class="isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'"
            >
              <span>{{ isPlaying ? "⏸️ Pausar" : "▶️ Reproducir" }}</span>
            </button>

            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileUpload" 
              accept=".gp,.gp3,.gp4,.gp5,.gpx,.xml,.mid" 
              class="hidden" 
            />
            <button 
              @click="triggerFileInput"
              class="px-2.5 py-1.5 sm:py-2 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-xs font-semibold text-slate-200 border border-slate-600 transition cursor-pointer"
            >
              <span>📂 Cargar</span>
            </button>

            <div class="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
              <span class="text-[10px] text-slate-400">📄</span>
              <span class="text-[11px] text-emerald-400 font-mono font-medium max-w-[100px] sm:max-w-[160px] truncate">
                {{ currentFileName }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <span 
              class="text-[10px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full font-mono border"
              :class="isReady ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'"
            >
              {{ isReady ? "● Listo" : "⏳ Cargando..." }}
            </span>

            <div class="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/50">
              <label class="text-[11px] text-slate-300 font-medium">Vel:</label>
              <input 
                type="range" 
                min="0.25" 
                max="1.5" 
                step="0.05" 
                value="1" 
                @input="changeSpeed"
                class="w-16 sm:w-24 accent-emerald-500 cursor-pointer"
              />
              <span class="text-[11px] font-mono text-emerald-400 font-bold w-9 text-right">
                {{ playbackSpeed }}%
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>

    <!-- CUERPO -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 relative z-10">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        
        <aside 
          v-show="viewMode === 'split'" 
          class="w-full lg:col-span-3 sticky top-36 sm:top-44"
        >
          <Fretboard :active-notes="activeNotes" orientation="vertical" />
        </aside>

        <section 
          v-show="viewMode !== 'split' || $windowWidth >= 1024"
          class="bg-white rounded-xl shadow-2xl p-3 sm:p-6 text-slate-900 min-h-[500px] sm:min-h-[600px] overflow-hidden relative transition-all duration-200 w-full"
          :class="viewMode === 'split' ? 'hidden lg:block lg:col-span-9' : 'lg:col-span-12'"
        >
          <div ref="alphaTabContainer" class="overflow-x-auto min-w-full touch-pan-x"></div>
        </section>

      </div>

    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-950 border-t border-slate-800/80 py-4 sm:py-6 px-4 text-center text-[11px] text-slate-500 space-y-1">
      <p>TabEngine — Plataforma interactiva de práctica e interpretación de guitarra.</p>
      <p>
        Apoyo y colaboraciones en 
        <a :href="paypalUrl" target="_blank" class="text-amber-400 underline font-medium hover:text-amber-300">PayPal</a>.
      </p>
    </footer>

  </div>
</template>

<script>
export default {
  data() {
    return {
      $windowWidth: window.innerWidth,
    };
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onResize() {
      this.$windowWidth = window.innerWidth;
    },
  },
};
</script>

<style>
.touch-pan-x {
  -webkit-overflow-scrolling: touch;
}

.at-cursor-bar,
.at-cursor-beat,
.at-selection {
  z-index: 1 !important;
  background: rgba(16, 185, 129, 0.2) !important;
  border-left: 2px solid #10b981 !important;
}

.at-surface {
  position: relative;
  z-index: 1;
}
</style>