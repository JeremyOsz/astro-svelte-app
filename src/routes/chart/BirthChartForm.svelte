<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { BirthData } from '$lib/types/types';

  const dispatch = createEventDispatcher<{ calculate: BirthData }>();

  let birthDate = '';
  let birthTime = '';
  let latitude = '';
  let longitude = '';
  let timezone = '';

  // Common timezone options
  const timezoneOptions = [
    { value: '-12', label: 'UTC-12 (Baker Island)' },
    { value: '-11', label: 'UTC-11 (Samoa)' },
    { value: '-10', label: 'UTC-10 (Hawaii)' },
    { value: '-9', label: 'UTC-9 (Alaska)' },
    { value: '-8', label: 'UTC-8 (Pacific Time)' },
    { value: '-7', label: 'UTC-7 (Mountain Time)' },
    { value: '-6', label: 'UTC-6 (Central Time)' },
    { value: '-5', label: 'UTC-5 (Eastern Time)' },
    { value: '-4', label: 'UTC-4 (Atlantic Time)' },
    { value: '-3', label: 'UTC-3 (Brazil)' },
    { value: '-2', label: 'UTC-2 (South Georgia)' },
    { value: '-1', label: 'UTC-1 (Azores)' },
    { value: '0', label: 'UTC+0 (London)' },
    { value: '1', label: 'UTC+1 (Paris)' },
    { value: '2', label: 'UTC+2 (Cairo)' },
    { value: '3', label: 'UTC+3 (Moscow)' },
    { value: '4', label: 'UTC+4 (Dubai)' },
    { value: '5', label: 'UTC+5 (Mumbai)' },
    { value: '6', label: 'UTC+6 (Dhaka)' },
    { value: '7', label: 'UTC+7 (Bangkok)' },
    { value: '8', label: 'UTC+8 (Beijing)' },
    { value: '9', label: 'UTC+9 (Tokyo)' },
    { value: '10', label: 'UTC+10 (Sydney)' },
    { value: '11', label: 'UTC+11 (Solomon Islands)' },
    { value: '12', label: 'UTC+12 (New Zealand)' }
  ];

  function handleSubmit() {
    if (!birthDate || !birthTime || !latitude || !longitude || !timezone) {
      alert('Please fill in all fields');
      return;
    }

    const birthData: BirthData = {
      date: birthDate,
      time: birthTime,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone: parseInt(timezone)
    };

    dispatch('calculate', birthData);
  }

  function setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude.toFixed(6);
          longitude = position.coords.longitude.toFixed(6);
          // Set timezone based on current time
          const offset = new Date().getTimezoneOffset() / -60;
          timezone = offset.toString();
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
</script>

<div class="birth-chart-form">
  <h2>Enter Birth Details</h2>
  
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="birth-date">Birth Date *</label>
      <input
        id="birth-date"
        type="date"
        bind:value={birthDate}
        required
        max={new Date().toISOString().split('T')[0]}
      />
    </div>

    <div class="form-group">
      <label for="birth-time">Birth Time *</label>
      <input
        id="birth-time"
        type="time"
        bind:value={birthTime}
        required
      />
      <small>If you don't know your exact birth time, use 12:00 PM</small>
    </div>

    <div class="form-group">
      <label for="latitude">Latitude *</label>
      <input
        id="latitude"
        type="number"
        bind:value={latitude}
        step="0.000001"
        placeholder="e.g., 40.7128"
        required
      />
      <small>Positive for North, negative for South</small>
    </div>

    <div class="form-group">
      <label for="longitude">Longitude *</label>
      <input
        id="longitude"
        type="number"
        bind:value={longitude}
        step="0.000001"
        placeholder="e.g., -74.0060"
        required
      />
      <small>Positive for East, negative for West</small>
    </div>

    <div class="form-group">
      <label for="timezone">Timezone *</label>
      <select id="timezone" bind:value={timezone} required>
        <option value="">Select timezone</option>
        {#each timezoneOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" on:click={setCurrentLocation}>
        Use Current Location
      </button>
      <button type="submit" class="btn-primary">
        Calculate Chart
      </button>
    </div>
  </form>

  <div class="form-help">
    <h3>Need Help?</h3>
    <ul>
      <li><strong>Birth Time:</strong> If you don't know your exact birth time, use 12:00 PM. This will give you a noon chart.</li>
      <li><strong>Coordinates:</strong> You can find your birth location coordinates using Google Maps or other mapping services.</li>
      <li><strong>Timezone:</strong> Make sure to use the timezone that was in effect at your birth time (accounting for daylight saving time if applicable).</li>
    </ul>
  </div>
</div>

<style>
  .birth-chart-form {
    max-width: 500px;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    margin-bottom: 0.25rem;
  }

  .form-group small {
    display: block;
    color: #666;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .btn-secondary:hover {
    background: #5a6268;
  }

  .form-help {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 0.5rem;
    border-left: 4px solid #667eea;
  }

  .form-help h3 {
    margin-top: 0;
    color: #333;
    font-size: 1.1rem;
  }

  .form-help ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .form-help li {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #555;
  }

  @media (max-width: 768px) {
    .form-actions {
      flex-direction: column;
    }
    
    .form-help {
      padding: 1rem;
    }
  }
</style> 