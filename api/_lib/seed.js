'use strict';

/**
 * Réalisations livrées avec le site : servent à amorcer la galerie à la première
 * utilisation du dashboard, et de secours si le stockage est vide.
 * (Copie embarquée pour rester disponible même sans le dossier /data.)
 */

const SEED = [
  {
    "id": "seed-1",
    "category": "africain",
    "title": "Assiettes généreuses",
    "caption": "Cuisine africaine",
    "image": "assets/plats-africains-assortiment.jpg",
    "alt": "Assortiment de plats généreux servis avec du riz, des légumes et des sauces",
    "lightbox": "Cuisine africaine — assiettes généreuses",
    "position": 1
  },
  {
    "id": "seed-2",
    "category": "africain",
    "title": "Le plaisir de partager",
    "caption": "Cuisine africaine",
    "image": "assets/repas-africain-partage.jpg",
    "alt": "Repas convivial partagé autour de plusieurs plats et accompagnements",
    "lightbox": "Cuisine africaine — repas à partager",
    "position": 2
  },
  {
    "id": "seed-3",
    "category": "africain",
    "title": "Accompagnements & braisé",
    "caption": "Cuisine africaine",
    "image": "assets/attieke-et-accompagnement.jpg",
    "alt": "Plat de crevettes en sauce accompagné de morceaux de manioc",
    "lightbox": "Cuisine africaine — accompagnements et braisé",
    "position": 3
  },
  {
    "id": "seed-4",
    "category": "africain",
    "title": "Sauce & accompagnement",
    "caption": "Cuisine africaine",
    "image": "assets/plat-africain-sauce.jpg",
    "alt": "Accompagnement jaune servi avec une sauce généreuse",
    "lightbox": "Cuisine africaine — sauce et accompagnement",
    "position": 4
  },
  {
    "id": "seed-5",
    "category": "europeen",
    "title": "Bouchées façon pizza",
    "caption": "Cuisine européenne",
    "image": "assets/mini-pizzas.jpg",
    "alt": "Petites pizzas dorées garnies de tomate, fromage et basilic",
    "lightbox": "Bouchées façon pizza",
    "position": 5
  },
  {
    "id": "seed-6",
    "category": "europeen",
    "title": "Œufs mimosa",
    "caption": "Entrée européenne",
    "image": "assets/entree-oeufs-mimosa.jpg",
    "alt": "Œufs mimosa garnis d’une crème jaune et d’herbes fraîches",
    "lightbox": "Œufs mimosa — entrée",
    "position": 6
  },
  {
    "id": "seed-7",
    "category": "entrees",
    "title": "Plateau gourmand à partager",
    "caption": "Entrées · assortiment",
    "image": "assets/assortiment-gourmand.jpg",
    "alt": "Assortiment de bouchées salées et mini-pizzas dans un plateau",
    "lightbox": "Plateau gourmand à partager",
    "position": 7
  },
  {
    "id": "seed-8",
    "category": "patisserie",
    "title": "Petits plaisirs sucrés",
    "caption": "Pâtisserie & douceurs",
    "image": "assets/gateaux-boites-assorties.jpg",
    "alt": "Boîtes de cupcakes, biscuits et petits choux assortis",
    "lightbox": "Assortiment de petits gâteaux",
    "position": 8
  },
  {
    "id": "seed-9",
    "category": "patisserie",
    "title": "Cakes & biscuits",
    "caption": "Pâtisserie & douceurs",
    "image": "assets/cakes-petits-biscuits.jpg",
    "alt": "Cakes dorés et petits biscuits présentés sur un plateau",
    "lightbox": "Cakes et biscuits maison",
    "position": 9
  },
  {
    "id": "seed-10",
    "category": "patisserie",
    "title": "Cakes & mignardises",
    "caption": "Pâtisserie & douceurs",
    "image": "assets/cakes-maison.jpg",
    "alt": "Cakes marbrés et mignardises servis avec une tasse de café",
    "lightbox": "Cakes et mignardises",
    "position": 10
  },
  {
    "id": "seed-11",
    "category": "patisserie",
    "title": "Douceurs sucrées",
    "caption": "Pâtisserie · pause douceur",
    "image": "assets/douceurs-sucrees.jpg",
    "alt": "Petits beignets en forme d’anneau saupoudrés de sucre glace",
    "lightbox": "Douceurs sucrées",
    "position": 11
  },
  {
    "id": "seed-12",
    "category": "anniversaire",
    "title": "Un jour à célébrer",
    "caption": "Gâteau d’anniversaire",
    "image": "assets/gateau-anniversaire-rose.jpg",
    "alt": "Gâteau d’anniversaire décoré de crème rose, de perles et d’un ruban",
    "lightbox": "Gâteau d’anniversaire rose",
    "position": 12
  },
  {
    "id": "seed-13",
    "category": "anniversaire",
    "title": "Gâteaux de fête",
    "caption": "Anniversaire · célébration",
    "image": "assets/collection-gateaux-fete.jpg",
    "alt": "Collection de gâteaux décorés pour des anniversaires et grandes célébrations",
    "lightbox": "Collection de gâteaux de fête",
    "position": 13
  },
  {
    "id": "seed-14",
    "category": "mariage",
    "title": "Gâteau de mariage",
    "caption": "Mariage · pièce montée",
    "image": "assets/gateau-mariage-reference.jpg",
    "alt": "Gâteau de mariage à plusieurs étages, décoré de fleurs roses et blanches",
    "lightbox": "Gâteau de mariage fleuri",
    "position": 14
  }
];

function realisations() {
  return SEED.map((item) => ({ ...item }));
}

module.exports = { realisations };
