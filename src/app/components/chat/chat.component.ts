import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})
export class ChatComponent {
    meId = '416544284885518';
    @ViewChild('messageInput') messageInput!: ElementRef;
    @ViewChild('messageContainer') messageContainer!: ElementRef;
    @ViewChild('bottomMarker') private bottomMarker!: ElementRef;

    lisConversations: any[] = [];
    activeConversation: any = {};
    listMessage: any[] = [];

    constructor(private chatService: ChatService) {}

    ngOnInit(): void {
        this.getConversations();
    }

    getConversations() {
        this.chatService.getListConversation().subscribe({
            next: (data: any) => {
                console.log('Conversations:', data);
                this.lisConversations = data;
            },
            error: (error) => {
                console.error('Error fetching conversations', error);
            }
        });
    }

    getListMessageOfConversation() {
        if (!this.activeConversation) return;

        this.chatService.getListMessage(this.activeConversation?.id).subscribe({
            next: (data: any) => {
                console.log('getListMessageOfConversation data:', data);
                this.listMessage = data.sort((a: any, b: any) => {
                    const timeA = new Date(a.createdTime).getTime();
                    const timeB = new Date(b.createdTime).getTime();
                    return timeA - timeB; // Sắp xếp giảm dần
                });

                setTimeout(() => {
                    this.scrollToBottom();
                }, 100);
            },
            error: (error) => {
                console.error('Error fetching messages', error);
            }
        });
    }

    sendMessage() {
        let message = this.messageInput.nativeElement.value;
        console.log('message = ', message);
        if (!message) return;
        let recipientId = this.getSenderForListConsevation(this.activeConversation).id;
        console.log('recipientId = ', recipientId);

        if (!this.activeConversation) return;

        this.chatService.sendMessage(recipientId, message).subscribe({
            next: (data: any) => {
                console.info('sendMessage success');

                setTimeout(() => {
                    this.getListMessageOfConversation();
                    this.messageInput.nativeElement.value = '';
                });
            },
            error: (error) => {
                console.error('Error fetching messages', error);
            }
        });
    }

    getSenderForListConsevation(item: any) {
        let sender: any = item?.senders;
        if (!sender) return {};

        return sender.find((x: any) => x.id != this.meId) || {};
    }

    getTextAvatarForListConsevation(username: any) {
        if (!username) return 'A';

        return username.substring(0, 2).toUpperCase();
    }

    onClickConversation(item: any) {
        this.activeConversation = item;
        this.getListMessageOfConversation();
    }

    scrollToBottom(): void {
        try {
            this.bottomMarker.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } catch (err) {
            console.error('Scroll error', err);
        }
    }

    isDisplayChatContainer() {
        if (!this.activeConversation) return false;

        return Object.keys(this.activeConversation).length > 0;
    }

    refreshConversationMessage() {
        this.getListMessageOfConversation();
    }
}
