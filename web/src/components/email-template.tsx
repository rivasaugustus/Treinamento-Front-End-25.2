import * as React from 'react';

interface EmailTemplateProps {
    status: string;
}

export function EmailTemplate({ status }: EmailTemplateProps) {
    return (
        <div>
            <h1>Sua compra foi atualizada para o status {status} </h1>
        </div>
    );
}