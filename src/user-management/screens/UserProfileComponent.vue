<template>
  <div class="user-profile-container">
    <!-- Navigation -->
    <nav class="profile-nav">
      <button @click="goBack" class="back-btn">
        <i class="fas fa-arrow-left"></i>
        {{ $t('common.back') }}
      </button>
      <h1>{{ $t('userProfile.title') }}</h1>
      <button @click="editMode = !editMode" class="edit-btn">
        <i :class="editMode ? 'fas fa-times' : 'fas fa-edit'"></i>
        {{ editMode ? $t('common.cancel') : $t('common.edit') }}
      </button>
    </nav>

    <div class="profile-content">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-container">
            <img :src="user.avatar" :alt="user.name" class="avatar" />
            <button v-if="editMode" @click="changeAvatar" class="change-avatar-btn">
              <i class="fas fa-camera"></i>
            </button>
          </div>
          <div class="user-info">
            <h2 v-if="!editMode">{{ user.name }}</h2>
            <input v-else v-model="editedUser.name" class="edit-name" />
            <p class="member-since">{{ $t('userProfile.memberSince') }} {{ formatDate(user.memberSince) }}</p>
            <div class="badges">
              <span v-for="badge in user.badges" :key="badge" class="badge">{{ badge }}</span>
            </div>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ user.stats.totalSessions }}</div>
            <div class="stat-label">{{ $t('userProfile.sessions') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ user.stats.streakDays }}</div>
            <div class="stat-label">{{ $t('userProfile.streakDays') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ user.stats.stressReduction }}%</div>
            <div class="stat-label">{{ $t('userProfile.stressReduction') }}</div>
          </div>
        </div>
      </div>

      <!-- Profile Sections -->
      <div class="profile-sections">
        <!-- Subscription Information -->
        <div class="section subscription-section">
          <h3>
            <i class="fas fa-crown"></i>
            Estado de Suscripción
          </h3>
          <div v-if="loadingSubscription" class="loading-subscription">
            <i class="fas fa-spinner fa-spin"></i>
            Cargando información de suscripción...
          </div>
          <div v-else-if="subscription" class="subscription-info">
            <div class="subscription-status" :class="{ 'active': subscription.isActive, 'inactive': !subscription.isActive }">
              <div class="status-badge">
                <i :class="subscription.isActive ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                <span>{{ subscription.isActive ? 'Suscripción Activa' : 'Suscripción Inactiva' }}</span>
              </div>
              <div v-if="subscription.isActive" class="plan-info">
                <div class="plan-name">
                  <i class="fas fa-star"></i>
                  <strong>Plan {{ getPlanName(subscription.planId) }}</strong>
                </div>
                <div class="subscription-details">
                  <p><i class="fas fa-user"></i> {{ subscription.nameUser }} {{ subscription.lastNameUser }}</p>
                  <p><i class="fas fa-envelope"></i> {{ subscription.emailUser }}</p>
                  <p><i class="fas fa-credit-card"></i> •••• {{ subscription.numberCard.slice(-4) }}</p>
                </div>
              </div>
              <div v-else class="no-subscription">
                <p>No tienes una suscripción activa</p>
                <button @click="goToSubscriptions" class="subscribe-btn">
                  <i class="fas fa-crown"></i>
                  Ver Planes de Suscripción
                </button>
              </div>
            </div>
          </div>
          <div v-else-if="subscription === null" class="no-subscription-info">
            <div class="subscription-status inactive">
              <div class="status-badge">
                <i class="fas fa-info-circle"></i>
                <span>Sin Suscripción</span>
              </div>
              <div class="no-subscription">
                <p>Aún no tienes un plan de suscripción</p>
                <button @click="goToSubscriptions" class="subscribe-btn">
                  <i class="fas fa-crown"></i>
                  Ver Planes de Suscripción
                </button>
              </div>
            </div>
          </div>
          <div v-else class="no-subscription-data">
            <p>Ocurrió un error al cargar la información de suscripción</p>
            <button @click="retryLoadSubscription" class="retry-btn">
              <i class="fas fa-redo"></i>
              Reintentar
            </button>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="section">
          <h3>{{ $t('userProfile.personalInfo.title') }}</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Username (login)</label>
              <input 
                v-model="editedUser.username" 
                type="text" 
                :readonly="!editMode"
                :class="{ 'readonly': !editMode }"
                placeholder="Nombre de usuario para iniciar sesión"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('userProfile.personalInfo.email') }}</label>
              <input 
                v-model="editedUser.email" 
                type="email" 
                :readonly="!editMode"
                :class="{ 'readonly': !editMode }"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('userProfile.personalInfo.phone') }}</label>
              <input 
                v-model="editedUser.phone" 
                type="tel" 
                :readonly="!editMode"
                :class="{ 'readonly': !editMode }"
                placeholder="Teléfono"
              />
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <input 
                v-model="editedUser.address" 
                type="text" 
                :readonly="!editMode"
                :class="{ 'readonly': !editMode }"
                placeholder="Dirección completa"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('userProfile.personalInfo.birthDate') }}</label>
              <input 
                v-model="editedUser.birthDate" 
                type="date" 
                :readonly="!editMode"
                :class="{ 'readonly': !editMode }"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('userProfile.personalInfo.gender') }}</label>
              <select 
                v-model="editedUser.gender" 
                :disabled="!editMode"
                :class="{ 'readonly': !editMode }"
              >
                <option value="">{{ $t('userProfile.personalInfo.genderOptions.select') }}</option>
                <option value="male">{{ $t('userProfile.personalInfo.genderOptions.male') }}</option>
                <option value="female">{{ $t('userProfile.personalInfo.genderOptions.female') }}</option>
                <option value="other">{{ $t('userProfile.personalInfo.genderOptions.other') }}</option>
                <option value="prefer-not-to-say">{{ $t('userProfile.personalInfo.genderOptions.preferNotToSay') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Health Information -->
        <div class="section">
          <h3>{{ $t('userProfile.healthInfo.title') }}</h3>
          <div class="form-grid">
            <div class="form-group full-width">
              <label>{{ $t('userProfile.healthInfo.medicalConditions') }}</label>
              <textarea 
                v-model="editedUser.medicalConditions" 
                :readonly="!editMode"
                :class="{ 'readonly': !editMode }"
                rows="3"
                :placeholder="$t('userProfile.healthInfo.medicalConditionsPlaceholder')"
              ></textarea>
            </div>
            <div class="form-group full-width">
              <label>{{ $t('userProfile.healthInfo.medications') }}</label>
              <textarea 
                v-model="editedUser.medications" 
                :readonly="!editMode"
                :class="{ 'readonly': !editMode }"
                rows="3"
                :placeholder="$t('userProfile.healthInfo.medicationsPlaceholder')"
              ></textarea>
            </div>
            <div class="form-group">
              <label>{{ $t('userProfile.healthInfo.stressLevel') }}</label>
              <div class="stress-level-container">
                <input 
                  v-model="editedUser.currentStressLevel" 
                  type="range" 
                  min="1" 
                  max="10" 
                  :disabled="!editMode"
                  class="stress-slider"
                />
                <span class="stress-value">{{ editedUser.currentStressLevel }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="section">
          <h3>{{ $t('userProfile.preferences.title') }}</h3>
          <div class="preferences-grid">
            <div class="preference-group">
              <h4>{{ $t('userProfile.preferences.notifications.title') }}</h4>
              <div class="toggle-item">
                <label>{{ $t('userProfile.preferences.notifications.sessionReminders') }}</label>
                <div class="toggle-switch">
                  <input 
                    v-model="editedUser.preferences.sessionReminders" 
                    type="checkbox" 
                    :disabled="!editMode"
                    id="sessionReminders"
                  />
                  <label for="sessionReminders" class="toggle-label"></label>
                </div>
              </div>
              <div class="toggle-item">
                <label>{{ $t('userProfile.preferences.notifications.breathingReminders') }}</label>
                <div class="toggle-switch">
                  <input 
                    v-model="editedUser.preferences.breathingReminders" 
                    type="checkbox" 
                    :disabled="!editMode"
                    id="breathingReminders"
                  />
                  <label for="breathingReminders" class="toggle-label"></label>
                </div>
              </div>
              <div class="toggle-item">
                <label>{{ $t('userProfile.preferences.notifications.weeklyUpdates') }}</label>
                <div class="toggle-switch">
                  <input 
                    v-model="editedUser.preferences.weeklyUpdates" 
                    type="checkbox" 
                    :disabled="!editMode"
                    id="weeklyUpdates"
                  />
                  <label for="weeklyUpdates" class="toggle-label"></label>
                </div>
              </div>
            </div>

            <div class="preference-group">
              <h4>{{ $t('userProfile.preferences.privacy.title') }}</h4>
              <div class="toggle-item">
                <label>{{ $t('userProfile.preferences.privacy.publicProfile') }}</label>
                <div class="toggle-switch">
                  <input 
                    v-model="editedUser.preferences.publicProfile" 
                    type="checkbox" 
                    :disabled="!editMode"
                    id="publicProfile"
                  />
                  <label for="publicProfile" class="toggle-label"></label>
                </div>
              </div>
              <div class="toggle-item">
                <label>{{ $t('userProfile.preferences.privacy.shareProgress') }}</label>
                <div class="toggle-switch">
                  <input 
                    v-model="editedUser.preferences.shareProgress" 
                    type="checkbox" 
                    :disabled="!editMode"
                    id="shareProgress"
                  />
                  <label for="shareProgress" class="toggle-label"></label>
                </div>
              </div>
            </div>

            <div class="preference-group">
              <h4>{{ $t('userProfile.preferences.sessions.title') }}</h4>
              <div class="form-group">
                <label>{{ $t('userProfile.preferences.sessions.preferredDuration') }}</label>
                <select 
                  v-model="editedUser.preferences.sessionDuration" 
                  :disabled="!editMode"
                  :class="{ 'readonly': !editMode }"
                >
                  <option value="30">{{ $t('userProfile.preferences.sessions.durations.30') }}</option>
                  <option value="45">{{ $t('userProfile.preferences.sessions.durations.45') }}</option>
                  <option value="60">{{ $t('userProfile.preferences.sessions.durations.60') }}</option>
                  <option value="90">{{ $t('userProfile.preferences.sessions.durations.90') }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ $t('userProfile.preferences.sessions.preferredMode') }}</label>
                <select 
                  v-model="editedUser.preferences.sessionMode" 
                  :disabled="!editMode"
                  :class="{ 'readonly': !editMode }"
                >
                  <option value="video">{{ $t('userProfile.preferences.sessions.modes.video') }}</option>
                  <option value="audio">{{ $t('userProfile.preferences.sessions.modes.audio') }}</option>
                  <option value="chat">{{ $t('userProfile.preferences.sessions.modes.chat') }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Emergency Contacts -->
        <div class="section">
          <h3>{{ $t('userProfile.emergencyContacts.title') }}</h3>
          <div class="emergency-contacts">
            <div v-for="(contact, index) in editedUser.emergencyContacts" :key="index" class="contact-item">
              <div class="form-grid">
                <div class="form-group">
                  <label>{{ $t('userProfile.emergencyContacts.name') }}</label>
                  <input 
                    v-model="contact.name" 
                    type="text" 
                    :readonly="!editMode"
                    :class="{ 'readonly': !editMode }"
                  />
                </div>
                <div class="form-group">
                  <label>{{ $t('userProfile.emergencyContacts.relationship') }}</label>
                  <input 
                    v-model="contact.relationship" 
                    type="text" 
                    :readonly="!editMode"
                    :class="{ 'readonly': !editMode }"
                  />
                </div>
                <div class="form-group">
                  <label>{{ $t('userProfile.emergencyContacts.phone') }}</label>
                  <input 
                    v-model="contact.phone" 
                    type="tel" 
                    :readonly="!editMode"
                    :class="{ 'readonly': !editMode }"
                  />
                </div>
                <div class="form-group" v-if="editMode">
                  <button @click="removeEmergencyContact(index)" class="remove-contact-btn">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            <button v-if="editMode" @click="addEmergencyContact" class="add-contact-btn">
              <i class="fas fa-plus"></i>
              {{ $t('userProfile.emergencyContacts.addContact') }}
            </button>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="section">
          <h3>{{ $t('userProfile.accountActions.title') }}</h3>
          <div class="account-actions">
            <button @click="changePassword" class="action-btn primary">
              <i class="fas fa-key"></i>
              {{ $t('userProfile.accountActions.changePassword') }}
            </button>
            <button @click="downloadData" class="action-btn secondary">
              <i class="fas fa-download"></i>
              {{ $t('userProfile.accountActions.downloadData') }}
            </button>
            <button @click="deleteAccount" class="action-btn danger">
              <i class="fas fa-trash"></i>
              {{ $t('userProfile.accountActions.deleteAccount') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Save/Cancel Buttons -->
      <div v-if="editMode" class="save-actions">
        <button @click="cancelEdit" class="cancel-btn">{{ $t('common.cancel') }}</button>
        <button @click="saveChanges" class="save-btn" :disabled="saving">
          {{ saving ? $t('userProfile.actions.saving') : $t('userProfile.actions.saveChanges') }}
        </button>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>{{ $t('userProfile.loading') }}</p>
    </div>
  </div>
</template>

<script>
import { HttpClient } from '../../services/HttpClient.js';

export default {
  name: 'UserProfileComponent',
  data() {
    return {
      loading: false,
      saving: false,
      editMode: false,
      loadingSubscription: false,
      subscription: null,
      user: {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        phone: '+1 (555) 123-4567',
        avatar: '/images-of-professionals/usuariodemo.jpg',
        birthDate: '1990-05-15',
        gender: 'male',
        memberSince: '2023-01-15',
        medicalConditions: 'Ansiedad generalizada',
        medications: 'Sertralina 50mg',
        currentStressLevel: 6,
        badges: ['Principiante'],
        stats: {
          totalSessions: 0,
          streakDays: 0,
          stressReduction: 0
        },
        preferences: {
          sessionReminders: true,
          breathingReminders: true,
          weeklyUpdates: false,
          publicProfile: false,
          shareProgress: true,
          sessionDuration: 60,
          sessionMode: 'video'
        },
        emergencyContacts: [
          {
            name: 'María Pérez',
            relationship: 'Esposa',
            phone: '+1 (555) 987-6543'
          }
        ]
      },
      editedUser: {
        preferences: {},
        emergencyContacts: []
      }
    };
  },
  
  mounted() {
    this.loadUserProfile(); // loadSubscriptionInfo() se llama automáticamente dentro
  },
  
  methods: {
    async loadUserProfile() {
      this.loading = true;
      try {
        // Obtener datos del usuario desde localStorage
        const userFromStorage = localStorage.getItem('user') || localStorage.getItem('currentUser');
        
        if (userFromStorage) {
          const userData = JSON.parse(userFromStorage);
          
          console.log('=== DEBUG PERFIL DE USUARIO ===');
          console.log('Datos en localStorage:', userData);
          console.log('userData.fullName:', userData.fullName);
          console.log('userData.name:', userData.name);
          console.log('userData.firstName:', userData.firstName);
          console.log('userData.lastName:', userData.lastName);
          console.log('userData.email:', userData.email);
          console.log('userData.username:', userData.username);
          console.log('userData.createdAt:', userData.createdAt);
          console.log('userData.memberSince:', userData.memberSince);
          
          // Mapear los datos del usuario registrado al perfil
          // Construir nombre completo PRIORIZANDO fullName del backend
          let fullName = 'Usuario';
          
          // 1. Prioridad: fullName del backend (NO email)
          if (userData.fullName && !userData.fullName.includes('@')) {
            fullName = userData.fullName;
          }
          // 2. Verificar si name existe y NO es un email
          else if (userData.name && !userData.name.includes('@')) {
            fullName = userData.name;
          } 
          // 3. Construir desde firstName y lastName
          else if (userData.firstName && userData.lastName) {
            fullName = `${userData.firstName} ${userData.lastName}`;
          } 
          // 4. Solo firstName
          else if (userData.firstName && !userData.firstName.includes('@')) {
            fullName = userData.firstName;
          }
          // 5. Si username NO es un email, usarlo
          else if (userData.username && !userData.username.includes('@')) {
            fullName = userData.username;
          }
          
          console.log('✅ Nombre final determinado:', fullName);
          
          // Obtener el ID del usuario
          const userId = userData.id || userData.userId;
          console.log('🆔 VERIFICACIÓN DE ID:');
          console.log('   - userData.id:', userData.id);
          console.log('   - userData.userId:', userData.userId);
          console.log('   - ID final asignado:', userId || 1);
          console.log('   - Tipo de ID:', typeof userId);
          
          if (!userId) {
            console.error('⚠️ ADVERTENCIA: No se encontró ID en los datos del usuario!');
            console.error('   userData completo:', userData);
          }
          
          this.user = {
            ...this.user,
            id: userId || 1,
            name: fullName,
            fullName: fullName,
            email: userData.email || 'usuario@neurozen.com',
            username: userData.username || userData.email || '',
            phone: userData.phoneNumber || userData.phone || '',
            address: userData.address || '',
            birthDate: userData.dateOfBirth || userData.birthDate || '',
            gender: userData.gender || '',
            avatar: userData.avatarUrl || userData.avatar || userData.profileImage || userData.photoUrl || '/images-of-professionals/usuariodemo.jpg',
            memberSince: userData.createdAt || userData.memberSince || userData.registrationDate || new Date().toISOString().split('T')[0],
            medicalConditions: userData.medicalConditions || userData.healthConditions || '',
            medications: userData.medications || userData.currentMedications || '',
            currentStressLevel: userData.currentStressLevel || userData.stressLevel || 5,
            badges: this.user.badges,
            stats: this.user.stats,
            preferences: {
              ...this.user.preferences,
              ...(userData.preferences || {})
            },
            emergencyContacts: userData.emergencyContacts || this.user.emergencyContacts
          };
          
          console.log('Perfil de usuario cargado:');
          console.log('- Nombre final:', this.user.name);
          console.log('- Email:', this.user.email);
          console.log('- Avatar:', this.user.avatar);
          console.log('=== FIN DEBUG ===');
        } else {
          console.warn('No se encontró información del usuario en localStorage');
          console.log('Intenta: localStorage.getItem("user") o localStorage.getItem("currentUser")');
        }
        
        // Copiar a editedUser para modo edición
        this.editedUser = JSON.parse(JSON.stringify(this.user));
        
        // Cargar suscripción DESPUÉS de tener el ID del usuario
        console.log('📋 Cargando información de suscripción para user.id:', this.user.id);
        await this.loadSubscriptionInfo();
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        this.loading = false;
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    
    changeAvatar() {
      // Generar iniciales del usuario
      const nameParts = this.user.name.split(' ');
      const initials = nameParts.length >= 2 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
        : nameParts[0].substring(0, 2).toUpperCase();
      
      // Avatares con diferentes colores
      const avatars = [
        '/images-of-professionals/usuariodemo.jpg',
        `https://ui-avatars.com/api/?name=${encodeURIComponent(this.user.name)}&size=120&background=667eea&color=fff&bold=true`,
        `https://ui-avatars.com/api/?name=${encodeURIComponent(this.user.name)}&size=120&background=48bb78&color=fff&bold=true`,
        `https://ui-avatars.com/api/?name=${encodeURIComponent(this.user.name)}&size=120&background=ed8936&color=fff&bold=true`,
        `https://ui-avatars.com/api/?name=${encodeURIComponent(this.user.name)}&size=120&background=f56565&color=fff&bold=true`
      ];
      
      const currentIndex = avatars.findIndex(a => a === this.editedUser.avatar);
      const nextIndex = currentIndex === -1 ? 1 : (currentIndex + 1) % avatars.length;
      this.editedUser.avatar = avatars[nextIndex];
    },
    
    addEmergencyContact() {
      this.editedUser.emergencyContacts.push({
        name: '',
        relationship: '',
        phone: ''
      });
    },
    
    removeEmergencyContact(index) {
      this.editedUser.emergencyContacts.splice(index, 1);
    },
    
    async saveChanges() {
      this.saving = true;
      
      console.log('=== INICIANDO GUARDADO ===');
      
      try {
        // Preparar datos para guardar
        const userToSave = {
          id: this.user.id,
          name: this.editedUser.name,
          fullName: this.editedUser.name,
          email: this.editedUser.email,
          username: this.editedUser.username || this.editedUser.email,
          phone: this.editedUser.phone,
          phoneNumber: this.editedUser.phone,
          address: this.editedUser.address || '',
          birthDate: this.editedUser.birthDate,
          dateOfBirth: this.editedUser.birthDate,
          gender: this.editedUser.gender,
          avatar: this.editedUser.avatar,
          avatarUrl: this.editedUser.avatar,
          memberSince: this.user.memberSince,
          medicalConditions: this.editedUser.medicalConditions,
          medications: this.editedUser.medications,
          currentStressLevel: this.editedUser.currentStressLevel,
          preferences: this.editedUser.preferences,
          emergencyContacts: this.editedUser.emergencyContacts
        };
        
        console.log('Datos a guardar:', userToSave);
        
        // PRIMERO: Actualizar en el backend
        const authToken = localStorage.getItem('authToken');
        
        console.log('authToken:', authToken ? 'Existe ✅' : 'NO existe ❌');
        console.log('user.id:', this.user.id);
        console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
        
        if (!authToken) {
          alert('No estás autenticado. Por favor inicia sesión nuevamente.');
          this.saving = false;
          return;
        }
        
        if (!this.user.id) {
          alert('No se encontró el ID de usuario. Por favor inicia sesión nuevamente.');
          this.saving = false;
          return;
        }
        
        // Formatear fecha de nacimiento
        let formattedDateOfBirth = null;
        if (userToSave.birthDate) {
          const date = new Date(userToSave.birthDate);
          if (!isNaN(date.getTime())) {
            formattedDateOfBirth = date.toISOString().split('T')[0];
          }
        }
        
        // Preparar request para el backend (DIRECTO sin wrapper)
        const requestData = {
          username: userToSave.username, // ✅ Usar el username editable
          email: userToSave.email,
          fullName: userToSave.name,
          phoneNumber: userToSave.phone || '',
          address: userToSave.address || '',
          avatarUrl: userToSave.avatar || '',
          dateOfBirth: formattedDateOfBirth
        };
        
        console.log('🚀 Enviando PUT a:', `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${this.user.id}`);
        console.log('📦 Request body (SIN wrapper resource):', JSON.stringify(requestData, null, 2));
        
        // Enviar PUT al backend
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${this.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(requestData)
        });
        
        console.log('📨 Response status:', response.status);
        console.log('📨 Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error del backend:', errorText);
          alert(`Error al guardar en el backend (${response.status}):\n${errorText}`);
          this.saving = false;
          return;
        }
        
        // Obtener respuesta del backend
        const updatedUser = await response.json();
        console.log('✅ Respuesta del backend:', updatedUser);
        
        // SEGUNDO: Actualizar datos locales solo si el backend tuvo éxito
        this.user = JSON.parse(JSON.stringify(this.editedUser));
        
        // Guardar en localStorage
        localStorage.setItem('user', JSON.stringify(userToSave));
        
        // También actualizar en currentUser si existe
        if (localStorage.getItem('currentUser')) {
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          const updatedCurrentUser = {
            ...currentUser,
            ...userToSave
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
        }
        
        console.log('✅ Datos guardados en localStorage');
        console.log('=== GUARDADO EXITOSO ===');
        
        // Salir del modo edición
        this.editMode = false;
        
        // Mostrar mensaje de éxito
        alert('✅ Perfil actualizado correctamente en el backend y guardado localmente');
        
      } catch (error) {
        console.error('❌ ERROR GENERAL:', error);
        alert(`Error al guardar el perfil: ${error.message}`);
      } finally {
        this.saving = false;
      }
    },
    
    cancelEdit() {
      this.editedUser = JSON.parse(JSON.stringify(this.user));
      this.editMode = false;
    },
    
    changePassword() {
      // Redirect to change password page or show modal
      alert(this.$t('userProfile.actions.changePasswordNotImplemented'));
    },
    
    downloadData() {
      // Mock data download
      const userData = {
        profile: this.user,
        downloadDate: new Date().toISOString(),
        format: 'JSON'
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `neurozen_data_${this.user.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    },
    
    deleteAccount() {
      const confirmed = confirm(
        this.$t('userProfile.actions.deleteAccountConfirm')
      );
      
      if (confirmed) {
        const doubleConfirm = confirm(
          this.$t('userProfile.actions.deleteAccountDoubleConfirm')
        );
        
        if (doubleConfirm) {
          alert(this.$t('userProfile.actions.deleteAccountNotImplemented'));
        }
      }
    },
    
    async loadSubscriptionInfo() {
      this.loadingSubscription = true;
      try {
        const userId = this.user.id;
        
        if (!userId) {
          console.warn('⚠️ No se encontró ID de usuario');
          this.subscription = null;
          return;
        }
        
        console.log('=== CARGANDO SUSCRIPCIÓN ===');
        console.log(`📥 Obteniendo suscripción del usuario ID: ${userId}`);
        console.log(`🔗 URL: /api/v1/subscriptions/user/${userId}`);
        
        // Usar HttpClient
        const httpClient = new HttpClient();
        
        // Llamar al endpoint de suscripción
        const subscriptionData = await httpClient.get(`/api/v1/subscriptions/user/${userId}`);
        
        console.log('✅ Datos de suscripción recibidos:', subscriptionData);
        console.log('   - ¿Es array?:', Array.isArray(subscriptionData));
        console.log('   - Tipo:', typeof subscriptionData);
        
        // El backend puede devolver un array con un solo elemento o un objeto
        let subscriptionObject = subscriptionData;
        if (Array.isArray(subscriptionData) && subscriptionData.length > 0) {
          console.log('📦 Backend devolvió array, tomando primer elemento');
          subscriptionObject = subscriptionData[0];
        }
        
        console.log('✅ Objeto de suscripción:', subscriptionObject);
        console.log('   - userId:', subscriptionObject.userId);
        console.log('   - planId:', subscriptionObject.planId);
        console.log('   - isActive:', subscriptionObject.isActive);
        console.log('   - Tipo de isActive:', typeof subscriptionObject.isActive);
        console.log('=== FIN CARGA SUSCRIPCIÓN ===');
        
        // Guardar la suscripción
        this.subscription = {
          userId: subscriptionObject.userId,
          planId: subscriptionObject.planId,
          nameUser: subscriptionObject.nameUser,
          lastNameUser: subscriptionObject.lastNameUser,
          emailUser: subscriptionObject.emailUser,
          numberCard: subscriptionObject.numberCard,
          expirationDate: subscriptionObject.expirationDate,
          cvv: subscriptionObject.cvv,
          isActive: subscriptionObject.isActive
        };
        
        console.log('🔍 VERIFICACIÓN POST-ASIGNACIÓN:');
        console.log('   - this.subscription:', this.subscription);
        console.log('   - this.subscription.isActive:', this.subscription.isActive);
        console.log('   - Tipo:', typeof this.subscription.isActive);
        
      } catch (error) {
        console.error('=== ERROR AL CARGAR SUSCRIPCIÓN ===');
        console.error('❌ Error completo:', error);
        console.error('   - Mensaje:', error.message);
        console.error('   - Status:', error.status);
        
        // Si el error es 404, significa que no tiene suscripción
        if (error.message.includes('404')) {
          console.log('ℹ️ El usuario no tiene ninguna suscripción registrada (404)');
          this.subscription = null;
        } else {
          console.error('⚠️ Error inesperado al obtener suscripción');
          this.subscription = null;
        }
        console.error('=== FIN ERROR ===');
      } finally {
        this.loadingSubscription = false;
      }
    },
    
    async retryLoadSubscription() {
      console.log('🔄 Reintentando cargar suscripción...');
      
      // Asegurar que tenemos el ID del usuario
      const userFromStorage = localStorage.getItem('user') || localStorage.getItem('currentUser');
      
      console.log('📦 Datos en localStorage:');
      console.log('   - localStorage.getItem("user"):', localStorage.getItem('user'));
      console.log('   - localStorage.getItem("currentUser"):', localStorage.getItem('currentUser'));
      
      if (userFromStorage) {
        const userData = JSON.parse(userFromStorage);
        console.log('✅ userData parseado:', userData);
        
        const userId = userData.id || userData.userId;
        
        console.log('🆔 Extrayendo ID:');
        console.log('   - userData.id:', userData.id);
        console.log('   - userData.userId:', userData.userId);
        console.log('   - ID final:', userId);
        
        if (userId) {
          console.log('✅ ID de usuario encontrado:', userId);
          this.user.id = userId;
          console.log('✅ this.user.id actualizado a:', this.user.id);
        } else {
          console.error('❌ No se pudo obtener el ID del usuario desde localStorage');
          console.error('📋 Datos completos del usuario:', userData);
          alert('Error: No se pudo obtener el ID del usuario.\n\nDatos en localStorage:\n' + JSON.stringify(userData, null, 2) + '\n\nPor favor, cierra sesión y vuelve a iniciar sesión.');
          return;
        }
      } else {
        console.error('❌ No hay datos de usuario en localStorage');
        console.error('📋 localStorage.getItem("user"):', localStorage.getItem('user'));
        console.error('📋 localStorage.getItem("currentUser"):', localStorage.getItem('currentUser'));
        alert('Error: No se encontraron datos de usuario en localStorage.\n\nPor favor, cierra sesión y vuelve a iniciar sesión.');
        return;
      }
      
      // Ahora intentar cargar la suscripción con el ID correcto
      console.log('📞 Llamando a loadSubscriptionInfo() con this.user.id:', this.user.id);
      await this.loadSubscriptionInfo();
    },
    
    getPlanName(planId) {
      const planNames = {
        0: 'Gratuito',
        1: 'Básico',
        2: 'Avanzado',
        3: 'Profesional'
      };
      return planNames[planId] || 'Desconocido';
    },
    
    goToSubscriptions() {
      this.$router.push('/subscriptions');
    },
    
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.user-profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #078330 0%, #54c470 100%);
  padding: 20px;
}

.profile-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.back-btn,
.edit-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover,
.edit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.profile-nav h1 {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.profile-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Profile Header */
.profile-header {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 30px;
  margin-bottom: 30px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #198a03;
}

.change-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #056b40;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.change-avatar-btn:hover {
  background: #18cf46;
}

.user-info h2 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 28px;
  font-weight: 700;
}

.edit-name {
  font-size: 28px;
  font-weight: 700;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 10px;
}

.member-since {
  color: #666;
  margin: 0 0 15px 0;
  font-size: 16px;
}

.badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  background: #057414;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9ff;
  border-radius: 15px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #054e1b;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

/* Sections */
.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section {
  background: #f8f9ff;
  border-radius: 15px;
  padding: 25px;
}

.section h3 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}

/* Forms */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #005704;
}

.form-group input.readonly,
.form-group select.readonly,
.form-group textarea.readonly {
  background: #f7fafc;
  color: #666;
}

.stress-level-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stress-slider {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  outline: none;
  appearance: none;
}

.stress-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #01680a;
  border-radius: 50%;
  cursor: pointer;
}

.stress-value {
  font-weight: 700;
  color: #097536;
  font-size: 18px;
  min-width: 30px;
  text-align: center;
}

/* Preferences */
.preferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.preference-group h4 {
  color: #333;
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.toggle-item:last-child {
  border-bottom: none;
}

.toggle-item label {
  color: #333;
  font-weight: 500;
  margin: 0;
}

.toggle-switch {
  position: relative;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-label {
  display: block;
  width: 50px;
  height: 28px;
  background: #e2e8f0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.toggle-label::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-switch input[type="checkbox"]:checked + .toggle-label {
  background: #036d03;
}

.toggle-switch input[type="checkbox"]:checked + .toggle-label::after {
  transform: translateX(22px);
}

.toggle-switch input[type="checkbox"]:disabled + .toggle-label {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Emergency Contacts */
.emergency-contacts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
}

.remove-contact-btn {
  background: #f56565;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: end;
  margin-top: 24px;
}

.add-contact-btn {
  background: #04880f;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
}

/* Subscription Section */
.subscription-section {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border: 2px solid #f0c419;
}

.subscription-section h3 {
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.subscription-section h3 i {
  color: #f0c419;
}

.loading-subscription {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  color: #333;
  font-weight: 500;
}

.loading-subscription i {
  font-size: 20px;
  color: #f0c419;
}

.subscription-info {
  padding: 10px 0;
}

.subscription-status {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.subscription-status.active {
  border-left: 5px solid #48bb78;
}

.subscription-status.inactive {
  border-left: 5px solid #f56565;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.status-badge i {
  font-size: 24px;
}

.subscription-status.active .status-badge i {
  color: #48bb78;
}

.subscription-status.inactive .status-badge i {
  color: #f56565;
}

.status-badge span {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.plan-info {
  margin-top: 15px;
}

.plan-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.plan-name i {
  color: #ffd700;
  font-size: 22px;
}

.subscription-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
}

.subscription-details p {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
  color: #555;
  font-size: 14px;
}

.subscription-details i {
  color: #667eea;
  width: 20px;
}

.no-subscription {
  text-align: center;
  padding: 20px;
}

.no-subscription p {
  color: #666;
  margin-bottom: 20px;
  font-size: 16px;
}

.subscribe-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.subscribe-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.subscribe-btn i {
  font-size: 18px;
}

.no-subscription-info {
  padding: 10px 0;
}

.no-subscription-data {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
}

.no-subscription-data p {
  color: #666;
  margin-bottom: 20px;
}

.retry-btn {
  background: #48bb78;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #38a169;
  transform: translateY(-1px);
}

/* Account Actions */
.account-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-btn {
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a67d8;
}

.action-btn.secondary {
  background: #48bb78;
  color: white;
}

.action-btn.secondary:hover {
  background: #38a169;
}

.action-btn.danger {
  background: #f56565;
  color: white;
}

.action-btn.danger:hover {
  background: #e53e3e;
}

/* Save Actions */
.save-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  background: #e2e8f0;
  color: #666;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.save-btn {
  background: #48bb78;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #107406;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .user-profile-container {
    padding: 10px;
  }
  
  .profile-content {
    padding: 20px;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .preferences-grid {
    grid-template-columns: 1fr;
  }
  
  .account-actions {
    grid-template-columns: 1fr;
  }
  
  .save-actions {
    flex-direction: column;
  }
}
</style>
