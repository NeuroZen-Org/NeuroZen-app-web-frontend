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
        <!-- Personal Information -->
        <div class="section">
          <h3>{{ $t('userProfile.personalInfo.title') }}</h3>
          <div class="form-grid">
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
export default {
  name: 'UserProfileComponent',
  data() {
    return {
      loading: false,
      saving: false,
      editMode: false,
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
        badges: ['Principiante', 'Constante'],
        stats: {
          totalSessions: 24,
          streakDays: 7,
          stressReduction: 35
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
    this.loadUserProfile();
  },
  
  methods: {
    async loadUserProfile() {
      this.loading = true;
      try {
        // Try to get user data from localStorage or API
        const userFromStorage = localStorage.getItem('user');
        if (userFromStorage) {
          this.user = { ...this.user, ...JSON.parse(userFromStorage) };
        }
        
        // Simulate API call for full profile data
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.editedUser = JSON.parse(JSON.stringify(this.user));
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
      // Mock avatar change
      const avatars = [
        '/api/placeholder/120/120',
        'https://via.placeholder.com/120x120/667eea/ffffff?text=JP',
        'https://via.placeholder.com/120x120/48bb78/ffffff?text=JP',
        'https://via.placeholder.com/120x120/ed8936/ffffff?text=JP'
      ];
      const currentIndex = avatars.indexOf(this.editedUser.avatar);
      const nextIndex = (currentIndex + 1) % avatars.length;
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
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update user data
        this.user = JSON.parse(JSON.stringify(this.editedUser));
        this.editMode = false;
        
        // Show success message
        alert(this.$t('userProfile.actions.successMessage'));
        
      } catch (error) {
        console.error('Error saving profile:', error);
        alert(this.$t('userProfile.actions.errorMessage'));
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
    
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.user-profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  border: 4px solid #667eea;
}

.change-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #667eea;
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
  background: #5a67d8;
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
  background: #667eea;
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
  color: #667eea;
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
  border-color: #667eea;
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
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.stress-value {
  font-weight: 700;
  color: #667eea;
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
  background: #667eea;
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
  background: #667eea;
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
  border-top: 4px solid #667eea;
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
