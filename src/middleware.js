import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request) {
    let token = request.cookies.get('token');
    console.log(request.nextUrl.pathname);
    console.log(token);
    if (
        request.nextUrl.pathname.startsWith('/student-landing') ||
        request.nextUrl.pathname.startsWith('/professors') ||
        request.nextUrl.pathname.startsWith('/reservations')
    ) {
        const authorizationCode = request.nextUrl.searchParams.get('token');

        if (authorizationCode) {
            // This is an OAuth callback, allow the request to proceed
            return NextResponse.next();
        }
        if (token == undefined) {
            return NextResponse.redirect(new URL('http://localhost:3000'));
        } else {
            const decoded = jwt.decode(token.value, '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970');
            const role = decoded.role.toLowerCase();
            if (role == 'professor') return NextResponse.redirect(new URL('/professor-landing', request.url));
            if (role === 'admin') return NextResponse.redirect(new URL('/admin-landing', request.url));
        }
    } else if (request.nextUrl.pathname.startsWith('/professor-landing')) {
        if (token == undefined) {
            return NextResponse.redirect(new URL('http://localhost:3000'));
        } else {
            const decoded = jwt.decode(token.value, '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970');
            const role = decoded.role.toLowerCase();
            if (role == 'student') return NextResponse.redirect(new URL('/student-landing', request.url));
            if (role === 'admin') return NextResponse.redirect(new URL('/admin-landing', request.url));
        }
    } else if (
        request.nextUrl.pathname.startsWith('/admin-landing') ||
        request.nextUrl.pathname.startsWith('/all-students') ||
        request.nextUrl.pathname.startsWith('/all-professors') ||
        request.nextUrl.pathname.startsWith('/all-professors') ||
        request.nextUrl.pathname.startsWith('/feedbacks') ||
        request.nextUrl.pathname.startsWith('/validator')
    ) {
        if (token == undefined) {
            return NextResponse.redirect(new URL('http://localhost:3000'));
        } else {
            const decoded = jwt.decode(token.value, '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970');
            const role = decoded.role.toLowerCase();
            if (role == 'student') return NextResponse.redirect(new URL('/student-landing', request.url));
            if (role === 'professor') return NextResponse.redirect(new URL('/professor-landing', request.url));
        }
    } else if (request.nextUrl.pathname == '' || request.nextUrl.pathname == '/') {
        if (token != undefined) {
            const decoded = jwt.decode(token.value, '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970');
            const role = decoded.role.toLowerCase();
            if (role == 'student') return NextResponse.redirect(new URL('/student-landing', request.url));
            if (role === 'professor') return NextResponse.redirect(new URL('/professor-landing', request.url));
            if (role === 'admin') return NextResponse.redirect(new URL('/admin-landing', request.url));
        }
    } else if (request.nextUrl.pathname.startsWith('/classes') || request.nextUrl.pathname.startsWith('/reservation')) {
        if (token == undefined) {
            return NextResponse.redirect(new URL('http://localhost:3000'));
        } else {
            const decoded = jwt.decode(token.value, '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970');
            const role = decoded.role.toLowerCase();
            if (role == 'admin') return NextResponse.redirect(new URL('/admin-landing', request.url));
        }
    } else if (request.nextUrl.pathname.startsWith('/personal-data')) {
        if (token == undefined) {
            return NextResponse.redirect(new URL('http://localhost:3000'));
        }
    } else if (token != undefined) {
        const decoded = jwt.decode(token.value, '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970');
        const role = decoded.role.toLowerCase();
        if (request.nextUrl.pathname == '' || request.nextUrl.pathname == '/') {
            if (role == 'professor') return NextResponse.redirect(new URL('/professor-landing', request.url));
            if (role === 'admin') return NextResponse.redirect(new URL('/admin-landing', request.url));
            if (role === 'student') {
                return NextResponse.redirect(new URL('/student-landing', request.url));
            }
        }
    }
    return NextResponse.next();
}
