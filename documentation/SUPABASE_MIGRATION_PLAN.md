# Supabase Migration Plan for Astro Chart App

## Overview

This document outlines the step-by-step migration plan for moving the astrology app from localStorage-based chart storage to Supabase, including user authentication, database storage, and real-time features.

## Current State Analysis

### Existing Storage System
- **Location**: `src/lib/services/chart-storage.ts`
- **Storage**: Browser localStorage
- **Data Structure**: 
  - `SavedChart` interface with id, name, birthData, chartData, timestamps
  - `ChartStorage` interface with savedCharts array and settings
- **Limitations**: 
  - No user authentication
  - Data limited to single device
  - No data backup
  - No sharing between devices

### Current Store Integration
- **Location**: `src/lib/stores/chart-store.ts`
- **Features**: Chart saving, loading, deletion, URL sharing
- **Dependencies**: ChartStorageService, URLSharingService

## Migration Phases

### Phase 1: Supabase Setup & Authentication (Week 1)

#### 1.1 Project Setup
- [ ] Create Supabase project
- [ ] Install Supabase client: `pnpm add @supabase/supabase-js`
- [ ] Configure environment variables
- [ ] Set up TypeScript types for Supabase

#### 1.2 Database Schema Design
```sql
-- Users table (handled by Supabase Auth)
-- auth.users (built-in)

-- Charts table
CREATE TABLE charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_data JSONB NOT NULL,
  chart_data TEXT NOT NULL,
  house_system TEXT DEFAULT 'whole_sign',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE user_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  auto_save BOOLEAN DEFAULT true,
  default_house_system TEXT DEFAULT 'whole_sign',
  default_location JSONB,
  last_viewed_chart_id UUID REFERENCES charts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Charts policies
CREATE POLICY "Users can view own charts" ON charts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own charts" ON charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own charts" ON charts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own charts" ON charts
  FOR DELETE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

#### 1.3 Authentication Service
- [ ] Create `src/lib/services/auth-service.ts`
- [ ] Implement sign up, sign in, sign out methods
- [ ] Add password reset functionality
- [ ] Create auth store for reactive user state

#### 1.4 Authentication Components
- [ ] Create `src/lib/components/auth/LoginForm.svelte`
- [ ] Create `src/lib/components/auth/SignUpForm.svelte`
- [ ] Create `src/lib/components/auth/UserMenu.svelte`
- [ ] Add authentication pages: `/login`, `/signup`

### Phase 2: Database Integration (Week 2)

#### 2.1 Updated Chart Storage Service
- [ ] Refactor `src/lib/services/chart-storage.ts` to use Supabase
- [ ] Implement async methods for all CRUD operations
- [ ] Add error handling and loading states
- [ ] Maintain backward compatibility with localStorage

#### 2.2 Chart Store Updates
- [ ] Update `src/lib/stores/chart-store.ts` for async operations
- [ ] Add loading states for database operations
- [ ] Implement real-time subscriptions for chart updates
- [ ] Add error handling for network issues

#### 2.3 User Settings Service
- [ ] Create `src/lib/services/user-settings-service.ts`
- [ ] Implement settings CRUD operations
- [ ] Add default settings creation on user signup
- [ ] Create settings store for reactive state

### Phase 3: UI/UX Updates (Week 3)

#### 3.1 Authentication UI
- [ ] Design login/signup pages with Tailwind CSS
- [ ] Add loading states and error handling
- [ ] Implement "Remember me" functionality
- [ ] Add social login options (Google, GitHub)

#### 3.2 Protected Routes
- [ ] Create `src/hooks.server.ts` for route protection
- [ ] Add authentication guards for sensitive routes
- [ ] Implement redirect logic for unauthenticated users
- [ ] Add session persistence

#### 3.3 User Dashboard
- [ ] Create `/dashboard` route for authenticated users
- [ ] Display user's saved charts with search/filter
- [ ] Add chart management interface
- [ ] Implement user settings page

### Phase 4: Data Migration & Testing (Week 4)

#### 4.1 Data Migration Tool
- [ ] Create migration script to move localStorage data to Supabase
- [ ] Add data validation and error handling
- [ ] Implement progress tracking for large datasets
- [ ] Add rollback functionality

#### 4.2 Testing Strategy
- [ ] Unit tests for new services
- [ ] Integration tests for database operations
- [ ] E2E tests for authentication flow
- [ ] Performance testing for chart operations

#### 4.3 Error Handling & Fallbacks
- [ ] Implement offline mode with localStorage fallback
- [ ] Add retry logic for failed network requests
- [ ] Create user-friendly error messages
- [ ] Add data sync indicators

### Phase 5: Advanced Features (Week 5)

#### 5.1 Real-time Features
- [ ] Implement real-time chart updates across devices
- [ ] Add live collaboration indicators
- [ ] Create shared chart functionality
- [ ] Add real-time notifications

#### 5.2 Performance Optimizations
- [ ] Implement chart data caching
- [ ] Add pagination for large chart lists
- [ ] Optimize database queries
- [ ] Add CDN for static assets

#### 5.3 Analytics & Monitoring
- [ ] Add usage analytics
- [ ] Implement error tracking
- [ ] Add performance monitoring
- [ ] Create admin dashboard

## Implementation Details

### Environment Configuration
```env
# .env.local
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Type Definitions
```typescript
// src/lib/types/supabase.ts
export interface Database {
  public: {
    Tables: {
      charts: {
        Row: {
          id: string
          user_id: string
          name: string
          birth_data: BirthData
          chart_data: string
          house_system: 'whole_sign' | 'placidus'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Insert>
      }
      user_settings: {
        Row: {
          user_id: string
          auto_save: boolean
          default_house_system: 'whole_sign' | 'placidus'
          default_location: any
          last_viewed_chart_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Row, 'created_at' | 'updated_at'>
        Update: Partial<Insert>
      }
    }
  }
}
```

### Service Architecture
```
src/lib/services/
├── auth-service.ts          # Authentication operations
├── chart-storage.ts         # Chart CRUD operations
├── user-settings-service.ts # User preferences
└── migration-service.ts     # Data migration utilities
```

### Store Updates
```
src/lib/stores/
├── chart-store.ts           # Updated for async operations
├── auth-store.ts            # New: User authentication state
└── settings-store.ts        # New: User settings state
```

## Risk Mitigation

### Data Loss Prevention
- [ ] Implement comprehensive backup strategy
- [ ] Add data validation before migration
- [ ] Create rollback procedures
- [ ] Test migration with sample data

### User Experience
- [ ] Maintain localStorage as fallback during transition
- [ ] Add clear migration progress indicators
- [ ] Provide user guidance during migration
- [ ] Ensure no downtime during deployment

### Performance Considerations
- [ ] Implement lazy loading for chart data
- [ ] Add caching strategies
- [ ] Optimize database queries
- [ ] Monitor real-time subscription performance

## Success Metrics

### Technical Metrics
- [ ] Database response times < 200ms
- [ ] Authentication success rate > 99%
- [ ] Data migration success rate > 99.9%
- [ ] Zero data loss during migration

### User Experience Metrics
- [ ] User retention after migration > 95%
- [ ] Chart save/load success rate > 99%
- [ ] Cross-device sync reliability > 99%
- [ ] User satisfaction score > 4.5/5

## Post-Migration Tasks

### Cleanup
- [ ] Remove localStorage fallback code
- [ ] Clean up unused dependencies
- [ ] Update documentation
- [ ] Archive old storage service

### Monitoring
- [ ] Set up error alerting
- [ ] Monitor database performance
- [ ] Track user engagement metrics
- [ ] Monitor authentication success rates

### Future Enhancements
- [ ] Add social sharing features
- [ ] Implement chart templates
- [ ] Add collaborative features
- [ ] Create mobile app

## Timeline Summary

| Week | Phase | Key Deliverables |
|------|-------|------------------|
| 1 | Setup & Auth | Supabase project, authentication system |
| 2 | Database | Chart storage service, user settings |
| 3 | UI/UX | Authentication pages, protected routes |
| 4 | Migration | Data migration tool, testing |
| 5 | Advanced | Real-time features, optimizations |

## Dependencies

### External Dependencies
- Supabase account and project
- Environment variables setup
- Database schema creation
- Authentication provider configuration

### Internal Dependencies
- Existing chart calculation services
- Current UI components
- Chart visualization components
- URL sharing functionality

## Rollback Plan

If issues arise during migration:
1. **Immediate**: Revert to localStorage-based storage
2. **Short-term**: Fix issues and retry migration
3. **Long-term**: Implement hybrid approach if needed

## Conclusion

This migration plan provides a comprehensive roadmap for transitioning from localStorage to Supabase while maintaining user experience and data integrity. The phased approach allows for incremental testing and validation at each step, minimizing risk and ensuring a smooth transition for users. 