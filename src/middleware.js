import { NextResponse } from 'next/server';

export function middleware(request) {
    // let user = request.cookies.get('user');
    // if (user == null) {
    //     if (request.nextUrl.pathname.startsWith('/')) {
    //         return NextResponse.rewrite(new URL('/', request.url));
    //     }
    // } else {
    //     if (request.nextUrl.pathname.startsWith('')) {
    //         if (user.role == 'professor') return NextResponse.rewrite(new URL('/professor-landing', request.url));
    //         if (user.role === 'admin') return NextResponse.rewrite(new URL('/admin-landing', request.url));
    //         if (user.role === 'student') {
    //             console.log('holaaa');
    //             return NextResponse.rewrite(new URL('/student-landing', request.url));
    //         }
    //     }
    //     if (request.nextUrl.pathname.startsWith('/student-landing')) {
    //         if (user.role == 'professor') return NextResponse.rewrite(new URL('/professor-landing', request.url));
    //         if (user.role == 'admin') return NextResponse.rewrite(new URL('/admin-landing', request.url));
    //     }
    // }
}
