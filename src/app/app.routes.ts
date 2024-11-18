import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FacebookChatComponent } from './components/facebook-chat/facebook-chat.component';
import { ZaloChatComponent } from './components/zalo-chat/zalo-chat.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'facebook',
        component: FacebookChatComponent
    },
    {
        path: 'zalo',
        component: ZaloChatComponent
    }
];
