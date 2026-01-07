<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

// Register ChartJS modules
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const adminStore = useAdminStore()

async function handleSeed() {
  if (confirm('¿Estás seguro de que quieres sembrar datos de prueba? Esto podría duplicar algunos registros.')) {
    try {
      await adminStore.seedData()
      alert('Datos sembrados con éxito. Recargando estadísticas...')
      await adminStore.fetchStats()
    } catch (err) {
      alert('Error al sembrar datos.')
    }
  }
}

// Chart Data: City Distribution
const cityChartData = computed<ChartData<'bar'>>(() => {
  if (!adminStore.stats) return { labels: [], datasets: [] }

  const labels = adminStore.stats.cityDistribution.map(c => c._id || 'Desconocido')
  const counts = adminStore.stats.cityDistribution.map(c => c.count)

  return {
    labels,
    datasets: [
      {
        label: 'Usuarios por Ciudad',
        data: counts,
        backgroundColor: '#7cfc00', // Sambo green
        borderRadius: 8,
      }
    ]
  }
})

const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#f8fafc',
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#94a3b8' }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#94a3b8' }
    }
  }
}

// Chart Data: Account Type Distribution
const accountChartData = computed<ChartData<'doughnut'>>(() => {
  if (!adminStore.stats) return { labels: [], datasets: [] }

  const labels = adminStore.stats.accountTypeDistribution.map(a => a._id)
  const counts = adminStore.stats.accountTypeDistribution.map(a => a.count)

  return {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          '#7cfc00', // founder/premium
          '#3b82f6', // premium
          '#64748b', // student
          '#1e293b'  // free
        ],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  }
})

const doughnutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#94a3b8',
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 8
    }
  },
  cutout: '70%'
}

onMounted(async () => {
  await adminStore.fetchStats()
})
</script>

<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <div class="header-content">
        <h1>Dashboard de Director</h1>
        <p>Visualización de métricas y gestión de la plataforma.</p>
      </div>
      <div class="header-actions">
        <button @click="handleSeed" class="btn-seed" :disabled="adminStore.loading">
          <i class="fa-solid fa-seedling"></i>
          {{ adminStore.loading ? 'Sincronizando...' : 'Sembrar Datos' }}
        </button>
      </div>
    </header>

    <div v-if="adminStore.loading && !adminStore.stats" class="loading-state">
      <i class="fa-solid fa-circle-notch fa-spin"></i>
      Obteniendo métricas en tiempo real...
    </div>

    <div v-else-if="adminStore.stats" class="stats-container">
      <!-- Main KPIs -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon-wrapper">
            <i class="fa-solid fa-users"></i>
          </div>
          <div class="info">
            <span class="label">Total Usuarios</span>
            <span class="value">{{ adminStore.stats.totalUsers }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon-wrapper">
            <i class="fa-solid fa-award"></i>
          </div>
          <div class="info">
            <span class="label">Certificados</span>
            <span class="value">{{ adminStore.stats.totalCertificates }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon-wrapper">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div class="info">
            <span class="label">Ciudades</span>
            <span class="value">{{ adminStore.stats.cityDistribution.length }}</span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="details-grid">
        <div class="details-card">
          <div class="card-header">
            <h3>Distribución por Ciudad</h3>
          </div>
          <div class="chart-scroll-wrapper">
            <div class="chart-container">
              <Bar :data="cityChartData" :options="barOptions" />
            </div>
          </div>
        </div>

        <div class="details-card">
          <div class="card-header">
            <h3>Tipos de Suscripción</h3>
          </div>
          <div class="chart-container">
            <Doughnut :data="accountChartData" :options="doughnutOptions" />
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="details-card wide">
          <div class="card-header">
            <h3>Líderes de Aprendizaje (Top Puntos)</h3>
          </div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Ciudad</th>
                  <th>Puntos</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in adminStore.stats.topUsers" :key="user.email">
                  <td>
                    <div class="user-info">
                      <span class="name">{{ user.name }}</span>
                      <span class="email">{{ user.email }}</span>
                    </div>
                  </td>
                  <td>{{ user.city || 'Desconocido' }}</td>
                  <td>
                    <span class="badge-points">{{ user.points }} pts</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>Error al sincronizar con el servidor de datos.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-dashboard {
  padding: 32px;
  max-width: 1200px; // Slightly tighter max-width
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--bg-main);
  overflow-x: hidden; // Prevent overall dashboard scroll

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;

    h1 {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 4px;
      letter-spacing: -0.5px;
    }

    p {
      color: var(--text-muted);
      font-size: 16px;
    }

    .btn-seed {
      background: var(--accent);
      color: #111;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px color-mix(in oklab, var(--accent), transparent 70%);

      &:hover:not(:disabled) {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 8px 20px color-mix(in oklab, var(--accent), transparent 40%);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 32px;

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px;
      display: flex;
      align-items: center;
      gap: 24px;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-4px);
      }

      .icon-wrapper {
        width: 64px;
        height: 64px;
        background: color-mix(in oklab, var(--accent), transparent 90%);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--accent);
        font-size: 24px;
      }

      .info {
        .label {
          display: block;
          font-size: 13px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .value {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-main);
        }
      }
    }
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 450px), 1fr)); // Responsive grid that won't blow out
    gap: 24px;

    .details-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
      min-width: 0; // Essential for grid child resizing
      overflow: hidden;

      &.wide {
        grid-column: 1 / -1;
      }

      .card-header {
        margin-bottom: 24px;

        h3 {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-main);
        }
      }

      .chart-scroll-wrapper {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar {
          height: 6px;
        }

        &::-webkit-scrollbar-track {
          background: var(--bg-main);
        }

        &::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }
      }

      .chart-container {
        height: 300px;
        width: 100%;
        position: relative;
        min-width: 0;
      }
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;

    th {
      padding: 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 700;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td {
      padding: 20px 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    .user-info {
      display: flex;
      flex-direction: column;

      .name {
        font-weight: 700;
        color: var(--text-main);
      }

      .email {
        font-size: 13px;
        color: var(--text-muted);
      }
    }

    .badge-points {
      background: color-mix(in oklab, var(--accent), transparent 85%);
      color: var(--accent);
      padding: 6px 14px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
    }
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: var(--text-muted);
    gap: 20px;

    i {
      font-size: 40px;
    }
  }
}

@media (max-width: 1024px) {
  .admin-dashboard {
    padding: 20px;

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    .details-card {
      padding: 20px;

      .chart-container:not(.doughnut) {
        // bar chart specifically
        min-width: 500px;
      }
    }
  }
}
</style>
