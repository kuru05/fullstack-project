<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        $response = new JsonResponse();

        if ($exception instanceof HttpExceptionInterface) {
            $response->setStatusCode($exception->getStatusCode());
            $response->setData([
                'error' => $exception->getMessage(),
                'code' => $exception->getStatusCode(),
            ]);
        } else {
            $response->setStatusCode(500);
            $response->setData([
                'error' => 'Erreur interne du serveur',
                'code' => 500,
            ]);
        }

        $event->setResponse($response);
    }
}
