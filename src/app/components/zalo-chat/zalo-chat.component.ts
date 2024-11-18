import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ZaloChatService } from '../../services/zalo-chat.service';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../services/websocket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-zalo-chat',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './zalo-chat.component.html',
    styleUrl: './zalo-chat.component.scss'
})
export class ZaloChatComponent {
    meId = '3520828479299876224';
    @ViewChild('messageInput') messageInput!: ElementRef;
    @ViewChild('messageContainer') messageContainer!: ElementRef;
    @ViewChild('bottomMarker') private bottomMarker!: ElementRef;

    lisConversations: any[] = [];
    activeConversation: any = {};
    listMessage: any[] = [];

    constructor(
        private chatService: ZaloChatService,
        private webSocketService: WebSocketService,
        private toastr: ToastrService
    ) {}

    private subscription: Subscription | null = null;

    messages: string[] = [];
    ngOnInit(): void {
        this.getConversations();

        // Kết nối WebSocket
        this.webSocketService.connect();

        // Lắng nghe message từ server
        this.subscription = this.webSocketService.getMessages().subscribe((message) => {
            console.log('message socket = ', message);
            // this.messages.push(message);
            this.handlerNewMessage(message);
        });
    }

    handlerNewMessage(msg: any) {
        if (!msg) return;

        const mgsJson = JSON.parse(msg);

        if (mgsJson.sender?.id === this.activeConversation?.id) {
            let newMessage = {
                id: mgsJson.sender.id,
                message: mgsJson.message.text,
                createdTime: mgsJson.timestamp,
                from: {
                    id: mgsJson.sender.id,
                    name: this.activeConversation?.senders[0].name,
                    email: '',
                    avatar: this.activeConversation?.senders[0]?.avatar
                }
            };

            this.listMessage.push(newMessage);
            this.listMessage = this.listMessage?.sort((a: any, b: any) => {
                return a.createdTime - b.createdTime;
            });

            this.toastr.success(newMessage.message, newMessage.from.name, {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'decreasing'
            });

            setTimeout(() => {
                this.scrollToBottom();
            }, 100);
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
        this.webSocketService.disconnect();
    }

    getConversations() {
        this.lisConversations = [
            {
                id: '1461524434136200474',
                updatedTime: '',
                link: '',
                messageCount: 0,
                snippet: 'New Message',
                unreadCount: 0,
                senders: [
                    {
                        id: '1461524434136200474',
                        name: 'Vũ Mạnh Tuấn',
                        email: '27861054113508128@facebook.com',
                        avatar: 'https://s240-ava-talk.zadn.vn/b/5/b/0/29/240/edfefc227063399ac0b6f929c5d143bb.jpg'
                    }
                ]
            },
            {
                id: '6944578670955309362',
                updatedTime: '',
                link: '',
                messageCount: 1,
                snippet: 'New Message',
                unreadCount: 1,
                senders: [
                    {
                        id: '6944578670955309362',
                        name: 'Linh',
                        email: '27861054113508128@facebook.com',
                        avatar: 'https://s240-ava-talk.zadn.vn/7/f/9/b/14/240/ef3fd48ca1c289acc428f57764b0b1b6.jpg'
                    }
                ]
            },
            {
                id: '8134501561442220721',
                updatedTime: '',
                link: '',
                messageCount: 1,
                snippet: 'New Message',
                unreadCount: 1,
                senders: [
                    {
                        id: '8134501561442220721',
                        name: 'Phúc Phan',
                        email: '27861054113508128@facebook.com',
                        avatar: 'https://s240-ava-talk.zadn.vn/2/6/3/1/5/240/5287297967b9a9e9923e1fed65f0352d.jpg'
                    }
                ]
            },
            {
                id: '999793921569848205',
                updatedTime: '',
                link: '',
                messageCount: 1,
                snippet: 'New Message',
                unreadCount: 1,
                senders: [
                    {
                        id: '999793921569848205',
                        name: 'Thanh Software',
                        email: '27861054113508128@facebook.com',
                        avatar: 'https://s240-ava-talk.zadn.vn/d/7/5/f/23/240/d7b10c809070acc204c2d0b111a77d11.jpg'
                    }
                ]
            }
        ];
    }

    getListMessageOfConversation() {
        if (!this.activeConversation) return;

        this.chatService.getListMessage(this.activeConversation?.id).subscribe({
            next: (data: any) => {
                console.log('getListMessageOfConversation data:', data);
                this.listMessage = data.sort((a: any, b: any) => {
                    return a.createdTime - b.createdTime;
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
        if (!message) return;

        let recipientId = this.getSenderForListConsevation(this.activeConversation).id;

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

    renderMessage(msg: any) {
        switch (msg.type) {
            case 'text': {
                return msg.message;
            }
            case 'photo': {
                return `<img src=${msg.thumb} alt="img" width="200" height="auto">`;
            }
            case 'sticker': {
                return `<img src=${msg.url} alt="img" width="80" height="auto">`;
            }
            default: {
                return 'Định dạng chưa hỗ trợ';
            }
        }
    }
}
