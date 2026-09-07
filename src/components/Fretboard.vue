<script setup>
const props = defineProps({
  activeNotes: {
    type: Array,
    default: () => [],
  },
  fretsCount: {
    type: Number,
    default: 24,
  },
  orientation: {
    type: String,
    default: "vertical",
  },
});

const stringNamesVertical = ["6º", "5º", "4º", "3º", "2º", "1º"];
const stringNamesHorizontal = ["E", "B", "G", "D", "A", "E"];

const singleInlays = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleInlays = [12, 24];

const isNoteActive = (stringIndex, fretNumber) => {
  if (!props.activeNotes || props.activeNotes.length === 0) return false;

  const targetString =
    props.orientation === "vertical" ? 6 - stringIndex : stringIndex + 1;

  return props.activeNotes.some(
    (note) => note.string === targetString && note.fret === fretNumber,
  );
};
</script>

<template>
  <!-- VISTA VERTICAL COMPACTA (Móviles y Tablets) -->
  <div
    v-if="orientation === 'vertical'"
    class="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 shadow-2xl flex flex-col w-full select-none"
  >
    <div class="flex justify-between items-center mb-2">
      <h3
        class="text-xs font-semibold text-slate-300 flex items-center gap-1.5"
      >
        <span>🎸</span> Mástil Vertical
      </h3>
      <span class="text-[10px] text-slate-500 font-mono">0 - 24 Trastes</span>
    </div>

    <!-- Nombres de cuerdas superior -->
    <div
      class="grid grid-cols-6 text-center text-xs font-mono text-slate-400 pb-2 border-b border-slate-800 font-bold"
    >
      <div v-for="(str, idx) in stringNamesVertical" :key="'v-str-' + idx">
        {{ str }}
      </div>
    </div>

    <!-- Mástil alargado (0 a 24 trastes) -->
    <div
      class="relative bg-amber-950/40 rounded border-x-2 border-amber-900/60 overflow-hidden mt-1.5"
    >
      <div class="flex flex-col">
        <div
          v-for="fret in fretsCount + 1"
          :key="'v-fret-' + (fret - 1)"
          class="grid grid-cols-6 relative items-center"
          :class="[
            fret - 1 === 0
              ? 'h-[24px] sm:h-[26px] bg-slate-900/90 border-b-4 border-slate-400/60'
              : 'h-[22px] sm:h-[25px] border-b border-slate-700/50',
          ]"
        >
          <!-- Número de traste lateral -->
          <div
            class="absolute left-1 text-[9px] sm:text-[10px] font-mono pointer-events-none z-10 font-medium"
            :class="
              fret - 1 === 0 ? 'text-emerald-400 font-bold' : 'text-slate-500'
            "
          >
            {{ fret - 1 === 0 ? "0" : fret - 1 }}
          </div>

          <!-- Puntos Inlays -->
          <div
            v-if="fret - 1 > 0"
            class="absolute inset-0 flex justify-center items-center pointer-events-none"
          >
            <div
              v-if="singleInlays.includes(fret - 1)"
              class="w-1.5 h-1.5 rounded-full bg-slate-400/20"
            ></div>
            <div v-if="doubleInlays.includes(fret - 1)" class="flex gap-3">
              <div class="w-1 h-1 rounded-full bg-slate-400/20"></div>
              <div class="w-1 h-1 rounded-full bg-slate-400/20"></div>
            </div>
          </div>

          <!-- Cuerdas -->
          <div
            v-for="(strName, strIdx) in stringNamesVertical"
            :key="'v-cell-' + strIdx + '-' + (fret - 1)"
            class="h-full border-r border-slate-600/30 flex items-center justify-center relative"
          >
            <!-- Punto de nota activa -->
            <div
              v-if="isNoteActive(strIdx, fret - 1)"
              class="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full font-bold text-[9px] sm:text-[10px] flex items-center justify-center shadow-md z-20 border"
              :class="
                fret - 1 === 0
                  ? 'bg-cyan-400 text-slate-950 shadow-cyan-500/50 border-cyan-200'
                  : 'bg-emerald-400 text-slate-950 shadow-emerald-500/50 border-emerald-200'
              "
            >
              {{ fret - 1 === 0 ? "O" : fret - 1 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- VISTA HORIZONTAL (0 a 24 trastes sin scroll horizontal) -->
  <div
    v-else
    class="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 shadow-2xl w-full select-none overflow-hidden"
  >
    <div class="flex justify-between items-center mb-2">
      <h3
        class="text-xs font-semibold text-slate-300 flex items-center gap-1.5"
      >
        <span>🎸</span> Mástil Horizontal
      </h3>
      <span class="text-[10px] text-slate-500 font-mono">0 - 24 Trastes</span>
    </div>

    <div class="w-full">
      <!-- Números de traste adaptables -->
      <div
        class="flex text-[8px] sm:text-[10px] text-slate-500 font-mono mb-1 pl-5 sm:pl-7"
      >
        <div
          v-for="fret in fretsCount + 1"
          :key="'num-' + (fret - 1)"
          class="flex-1 text-center truncate"
          :class="fret - 1 === 0 ? 'text-emerald-400 font-bold' : ''"
        >
          {{ fret - 1 }}
        </div>
      </div>

      <div
        class="relative bg-amber-950/40 rounded border-y-2 border-amber-900/60 p-1 sm:p-2"
      >
        <!-- Inlays -->
        <div class="absolute inset-0 flex pl-5 sm:pl-7 pointer-events-none">
          <div
            v-for="fret in fretsCount + 1"
            :key="'inlay-' + (fret - 1)"
            class="flex-1 flex flex-col justify-center items-center"
          >
            <div
              v-if="singleInlays.includes(fret - 1)"
              class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-400/20"
            ></div>
            <div
              v-if="doubleInlays.includes(fret - 1)"
              class="flex flex-col gap-3 sm:gap-4"
            >
              <div class="w-1 h-1 rounded-full bg-slate-400/20"></div>
              <div class="w-1 h-1 rounded-full bg-slate-400/20"></div>
            </div>
          </div>
        </div>

        <!-- Cuerdas ajustables sin scroll -->
        <div class="flex flex-col gap-1.5 sm:gap-2 relative z-10">
          <div
            v-for="(stringName, stringIdx) in stringNamesHorizontal"
            :key="'str-' + stringIdx"
            class="flex items-center"
          >
            <span
              class="w-5 sm:w-7 text-[10px] sm:text-xs font-bold font-mono text-slate-400"
              >{{ stringName }}</span
            >
            <div
              class="flex-1 flex items-center border-b border-slate-700/80 relative"
            >
              <div
                v-for="fret in fretsCount + 1"
                :key="'fret-' + stringIdx + '-' + (fret - 1)"
                class="flex-1 h-4 sm:h-5 flex items-center justify-center relative min-w-0"
                :class="
                  fret - 1 === 0
                    ? 'border-r-2 sm:border-r-4 border-slate-400/80 bg-slate-900/60'
                    : 'border-r border-slate-600/40'
                "
              >
                <!-- Punto de nota activa -->
                <div
                  v-if="isNoteActive(stringIdx, fret - 1)"
                  class="w-3 h-3 sm:w-4 sm:h-4 rounded-full font-bold text-[7px] sm:text-[9px] flex items-center justify-center shadow z-30"
                  :class="
                    fret - 1 === 0
                      ? 'bg-cyan-400 text-slate-950 border border-cyan-200'
                      : 'bg-emerald-400 text-slate-950 border border-emerald-200'
                  "
                >
                  {{ fret - 1 === 0 ? "O" : fret - 1 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
