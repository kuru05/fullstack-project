<?php

namespace App\Repository;

use App\Entity\Order;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class OrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Order::class);
    }

    public function generateReference(): string
    {
        $today = new \DateTime();
        $dateStr = $today->format('Y-m-d');
        $prefix = 'CMD-' . $dateStr;

        $lastOrder = $this->createQueryBuilder('o')
            ->where('o.reference LIKE :prefix')
            ->setParameter('prefix', $prefix . '%')
            ->orderBy('o.reference', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        if ($lastOrder === null) {
            return $prefix . 'A';
        }

        $lastRef = $lastOrder->getReference();
        $lastLetter = substr($lastRef, -1);
        $nextLetter = chr(ord($lastLetter) + 1);

        return $prefix . $nextLetter;
    }
}
