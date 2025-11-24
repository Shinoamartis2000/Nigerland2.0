#!/bin/bash

# Script to verify no secrets are in the codebase before pushing to GitHub

echo "🔍 Checking for secrets in codebase..."
echo ""

SECRETS_FOUND=0

# Check for Paystack secret keys
echo "Checking for Paystack secret keys..."
if grep -r "sk_live_[0-9a-f]" --exclude-dir=node_modules --exclude-dir=venv --exclude-dir=.git . 2>/dev/null | grep -v "example\|template\|placeholder\|YOUR_\|PAYSTACK_SECRET_KEY="; then
    echo "❌ FOUND Paystack secret keys!"
    SECRETS_FOUND=1
else
    echo "✅ No Paystack secrets found"
fi

echo ""

# Check for SendGrid API keys
echo "Checking for SendGrid API keys..."
if grep -r "SG\.[A-Za-z0-9]\{22\}\." --exclude-dir=node_modules --exclude-dir=venv --exclude-dir=.git . 2>/dev/null | grep -v "example\|template\|placeholder\|YOUR_\|SENDGRID_API_KEY="; then
    echo "❌ FOUND SendGrid API keys!"
    SECRETS_FOUND=1
else
    echo "✅ No SendGrid secrets found"
fi

echo ""

# Check for JWT secrets (if they're not placeholders)
echo "Checking for JWT secrets..."
if grep -r "JWT_SECRET_KEY=\"[a-zA-Z0-9]\{32,\}\"" --exclude-dir=node_modules --exclude-dir=venv --exclude-dir=.git . 2>/dev/null | grep -v "example\|template\|placeholder\|YOUR_\|GENERATE"; then
    echo "❌ FOUND JWT secrets!"
    SECRETS_FOUND=1
else
    echo "✅ No JWT secrets found"
fi

echo ""

# Check if .env files are in .gitignore
echo "Checking .gitignore configuration..."
if grep -q "\.env" .gitignore; then
    echo "✅ .env files are in .gitignore"
else
    echo "❌ .env not found in .gitignore!"
    SECRETS_FOUND=1
fi

echo ""
echo "================================"

if [ $SECRETS_FOUND -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED"
    echo "Safe to push to GitHub!"
    exit 0
else
    echo "❌ SECRETS DETECTED"
    echo "DO NOT push to GitHub until secrets are removed!"
    exit 1
fi
