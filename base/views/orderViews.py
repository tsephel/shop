from django.shortcuts import render

from base.models import Product, Order, OrderItem, ShippingAddress

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.serializers import ProductSerializer, OrderSerializer

from rest_framework import status

from datetime import datetime

# method to create order if the order was placed
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def orderItem(request):
    user = request.user
    data = request.data

    orderItems = data['orderItem']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        #Create Order
        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice']            
        )
        # Create shipping address 
        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode = data['shippingAddress']['postalCode'],
            country = data['shippingAddress']['country'],

        )
        # Create Order Items and set the order to order item relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product = product,
                order = order,
                name = product.name,
                qty = i['qty'],
                price = i['price'],
                image = product.image.url,
            )
            # Update Stock
            product.inStock -= item.qty
            product.save()

        serializers = OrderSerializer(order, many=False)
        return Response(serializers.data)

#method to get user orders
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserOrder(request):
    user = request.user
    order = user.order_set.all()
    serializer = OrderSerializer(order, many=True)

    return Response(serializer.data)

# method to get all the order for admin
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrder(request):
    order = Order.objects.all()
    serializer = OrderSerializer(order, many=True)

    return Response(serializer.data)

# method to get all the orders of a particular user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderId(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)

        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)

            return Response(serializer.data)
        
        else:
            Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

# method to chage the status if the payment is done
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updatePayment(request, pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    
    return Response('Order was paid')

# method to change the status if the item is delivered
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()
    
    return Response('Order was delivered')

     
