from django.shortcuts import render

from base.models import Product, Review

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.serializers import ProductSerializer

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework import status

# method the get the list of product
@api_view(['GET'])
def getProduct(request):
    #filter data
    q = request.query_params.get('keyword')
    if q == None:
        q = ''

    products = Product.objects.filter(name__icontains=q)

    #pagination 
    page = request.query_params.get('page')
    paginator = Paginator(products, 8)

    try:
        #if pass in the page from frontend throw whatever page we are on
        products = paginator.page(page)
    except PageNotAnInteger:
        # if the user has not clicked on any page(first page)
        products = paginator.page(1)
    except EmptyPage:
        #if the page that has no actual content
        products = paginator.page(paginator.num_pages)
    
    if page == None:
        page = 1

    #to ensure thats an integer
    page = int(page)
    print('Page', page)

    serializer = ProductSerializer(products, many=True)

    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})

# method to show the top rated products
@api_view(['GET'])
def featureProduct(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data)

# method the get the detail of particular product
@api_view(['GET'])
def productDetail(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)

# method to create product
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user = user,
        name = "Name",
        price = 0,
        brand = "Brand",
        inStock = 0,
        category = 'Category',
        description = ''
    )

    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)

#method to update product
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
   
    product = Product.objects.get(_id=pk)

    data = request.data

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.inStock = data['inStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


# method to delete product
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def productDelete(request, pk):
    products = Product.objects.get(_id=pk)
    products.delete()

    return Response('Product deleted')

# method to get the reviews
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def productReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # check if review already exist
    review_exist = product.review_set.filter(user=user).exists()

    if review_exist:
        content = {'detail': 'Product reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # checking if the user has rated the product
    elif data['rating'] == 0:
        content = {'detail': 'Please Select rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # creating review
    else:
        review = Review.objects.create(
            user = user,
            product = product,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment']
        )

        # quesrset to show the number of reviews of each products
        reviews = product.review_set.all()
        product.numReview = len(reviews)

        #geting the average of all rating 
        total = 0
        for i in reviews:
            total += i.rating
        
        product.rating = total / len(reviews)
        product.save() 

        return Response('Reivew added')